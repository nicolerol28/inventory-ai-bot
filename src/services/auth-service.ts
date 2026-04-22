import { config } from "../config/env.js";

export class AuthService {
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  // Token expiró o no existe, hacer login
  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }

    await this.login();
    return this.token!;
  }

  private async login(): Promise<void> {
    console.log("Authenticating with AI service...");

    const response = await fetch(`${config.aiService.url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: config.aiService.email,
        password: config.aiService.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Authentication failed (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    this.token = data.token;

    const expiresInMs = (data.expiresIn || 3600) * 1000;
    this.tokenExpiresAt = Date.now() + expiresInMs - 60_000;

    console.log("Authenticated successfully");
  }

  // Invalida el token actual, forzando un nuevo login en la próxima solicitud
  invalidateToken(): void {
    this.token = null;
    this.tokenExpiresAt = 0;
  }
}