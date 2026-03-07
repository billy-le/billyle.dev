import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { Resend } from "resend";
import { EmailTemplate } from "./email-templates/message";
import { logger } from "./utils/logger";
import { rateLimit } from "elysia-rate-limit";

const resend = new Resend(Bun.env.RESEND_API_KEY);
const serverPort = Bun.env.EMAIL_SERVER_PORT || 3000;

new Elysia()
  .state("requestId", "")
  .onRequest(({ request, store, set }) => {
    store.requestId = crypto.randomUUID();
    const ua = request.headers.get("user-agent") ?? "";
    const blocked = ["curl", "python-requests", "zgrab", "masscan", "nikto"];
    if (blocked.some((b) => ua.toLowerCase().includes(b))) {
      set.status = 403;
    }
  })
  .derive(({ store }) => ({ requestId: store.requestId }))
  .use(
    cors({
      methods: ["POST"],
      origin: (request) => {
        const origin = request.headers.get("origin");
        if (Bun.env.NODE_ENV !== "production") return true;
        return origin === Bun.env.ALLOWED_ORIGIN;
      },
    }),
  )
  .get("/ping", () => "pong")
  .get("/robots.txt", () => Bun.file("public/robots.txt"))
  .use(
    rateLimit({
      max: 3,
      duration: 5 * 60_000,
      generator: (req, server) => {
        return (
          server?.requestIP(req)?.address ??
          req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
          "unknown"
        );
      },
    }),
  )
  .post(
    "/send-email",
    async ({ body, set }) => {
      const { name, email, message } = body;

      try {
        const { error } = await resend.emails.send({
          from: `${name} <${Bun.env.EMAIL_TO}>`,
          replyTo: email,
          to: [Bun.env.EMAIL_TO],
          subject: `New Message Received From ${name}`,
          react: EmailTemplate({ name, email, message }),
        });

        if (error) {
          logger.error(`Resend Error: ${error.message}`);
          set.status = 500;
          return { success: false, error: error.message };
        }

        logger.info(`Email received from ${email}`);
        return { success: true, message: "Success" };
      } catch {
        set.status = 500;
        return { success: false, error: "Failed to process email request" };
      }
    },
    {
      body: t.Object({
        name: t.String({
          minLength: 3,
          error: "Name must be at least 3 characters",
        }),
        email: t.String({
          format: "email",
          error: "Invalid email format",
        }),
        message: t.String({
          minLength: 1,
          maxLength: 1024,
          error:
            "Message should be at least 10 characters and max of 1024 characters",
        }),
      }),
    },
  )
  .get("/*", ({ set, request, requestId, server }) => {
    const ip =
      server?.requestIP(request)?.address ??
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    logger.error(
      `id=${requestId} code=NOT_FOUND ip=${ip} url=${request.url} userAgent=${request.headers.get("user-agent")}`,
    );
    set.status = 404;
    return { success: false, message: "Not found" };
  })
  .onError(({ requestId, body, code, request, error, server }) => {
    const ip =
      server?.requestIP(request)?.address ??
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "unknown";

    const message = "message" in error ? error.message : String(error);
    const errorMessage = `id=${requestId} code=${code} method=${request.method} url=${request.url} error=${
      message
    } body=${JSON.stringify(body)} userAgent=${request.headers.get("user-agent")} ip=${ip}`;

    logger.error(errorMessage);

    if (code === "VALIDATION") {
      return {
        success: false,
        error: "Validation failed",
        details: error.all.map((e) => ({ path: e.path, message: e.message })),
      };
    }

    return {
      success: false,
      status: "error",
      message: "An unexpected server error occurred.",
    };
  })
  .listen(serverPort, () => {
    logger.info(`Server starting on PORT: ${serverPort}`);
  });
