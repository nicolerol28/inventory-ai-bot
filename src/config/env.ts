function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  telegram: {
    botToken: requireEnv("TELEGRAM_BOT_TOKEN"),
  },
  aiService: {
    url: requireEnv("AI_SERVICE_URL"),
    backendUrl: requireEnv("BACKEND_URL"),
    email: requireEnv("AI_SERVICE_EMAIL"),
    password: requireEnv("AI_SERVICE_PASSWORD"),
  },
  rateLimit: {
    maxMessages: parseInt(process.env["RATE_LIMIT_MESSAGES"] || "10"),
    windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "60000"),
  },
} as const;