import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: "https://00989e74aa26bc5066973c592ab89a34@o4507544338694144.ingest.us.sentry.io/4508280812601344",
  sendDefaultPii: true,
});
