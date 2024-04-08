declare module "bun" {
  interface Env {
    SERVER_PORT: string;
    RESEND_API_KEY: string;
    EMAIL_TO: string;
    ALLOWED_ORIGIN: string;
  }
}
