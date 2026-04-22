import { config } from "../config/env.js";
import { AuthService } from "./auth-service.js";

interface ChatResponse {
  answer?: string;
}

export class AIService {
  constructor(private authService: AuthService) {}

  async chat(message: string, threadId: string): Promise<string> {
    const makeRequest = async (): Promise<Response> => {
      const token = await this.authService.getToken();

      return fetch(`${config.aiService.url}/api/v1/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: message, threadId }),
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

    const data = (await response.json()) as ChatResponse;
    const answer = data.answer?.trim();
    if (!answer) {
      return "No pude generar una respuesta.";
    }
    return answer;
  }
}
