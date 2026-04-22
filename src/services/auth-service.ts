import { config } from "../config/env.js";

interface LoginResponse {
  token: string;
  expiresAt?: string;
}

export class AuthService {
  private token: string | null = null;
  private tokenExpiresAt: number = 0;

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiresAt) {
      return this.token;
    }
    return this.login();
  }

  private async login(): Promise<string> {
    console.log("Authenticating with AI service...");

    const response = await fetch(`${config.aiService.backendUrl}/api/v1/auth/login`, {
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

    const data = (await response.json()) as LoginResponse;

    if (!data.token) {
      throw new Error("Authentication succeeded but no token was returned");
    }

    this.token = data.token;

    // expiresAt es un timestamp ISO del backend Java
    // Renovamos 1 minuto antes de que expire
    if (data.expiresAt) {
      this.tokenExpiresAt = new Date(data.expiresAt).getTime() - 60_000;
    } else {
      this.tokenExpiresAt = Date.now() + 3600 * 1000 - 60_000;
    }

    console.log("Authenticated successfully");
    return this.token;
  }

  // Invalida el token actual, forzando un nuevo login en la próxima solicitud
  invalidateToken(): void {
    this.token = null;
    this.tokenExpiresAt = 0;
  }
}
