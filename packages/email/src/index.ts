import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { Resend } from "resend";
import { EmailTemplate } from "./email-templates/message";
import { logger } from "./utils/logger";

const resend = new Resend(Bun.env.RESEND_API_KEY);
const serverPort = Bun.env.SERVER_PORT || 3000;

new Elysia()
  .use(
    cors({
      methods: ["POST"],
      origin: [
        Bun.env.NODE_ENV === "production"
          ? Bun.env.ALLOWED_ORIGIN
          : "localhost:4321",
      ],
    })
  )
  .post(
    "/send",
    async (context) => {
      const { name, email, message } = context.body;

      const { error } = await resend.emails.send({
        from: `${name} <${Bun.env.EMAIL_TO}>`,
        to: [Bun.env.EMAIL_TO],
        subject: `New Message Received From ${name}`,
        react: EmailTemplate({ name, email, message }),
      });

      if (error) {
        return context.error((error as any).statusCode, error);
      }

      logger.info("New email received");
      return new Response(JSON.stringify({ message: "Success" }), {
        headers: {
          "content-type": "application/json",
        },
      });
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
      error: ({ path, body, request: { method }, error }) => {
        const errorMessage = `${method} ${path} ${
          error.message
        } ${JSON.stringify(body)}`;
        logger.error(errorMessage);
        return error;
      },
    }
  )
  .onError(({ path, request: { method }, error }) => {
    const errorMessage = `${method} ${path}`;
    logger.error(errorMessage, error);
    return error;
  })
  .listen(serverPort, () => {
    logger.info(`Server starting on PORT: ${serverPort}`);
  });
