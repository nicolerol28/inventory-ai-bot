import { config } from "../config/env.js";
import { AuthService } from "./auth-service.js";

export class AIService {
  constructor(private authService: AuthService) {}

  // Envía un mensaje al agente y devuelve su respuesta
  async chat(message: string, threadId: string): Promise<string> {
    const makeRequest = async (): Promise<Response> => {
      const token = await this.authService.getToken();

      return fetch(`${config.aiService.url}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message, threadId }),
      });
    };

    let response = await makeRequest();

    // Si el token expiró, re-autenticar y reintentar una sola vez
    if (response.status === 401) {
      console.log("Token expired, re-authenticating...");
      this.authService.invalidateToken();
      response = await makeRequest();
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI service error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.response || "No pude generar una respuesta.";
  }
}