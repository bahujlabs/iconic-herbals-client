// api/chatApi.js
import { api } from "../api/axios.js";

export const chatApi = {
  // Ask the chatbot a question.
  // payload: { message: string, conversationId?: string, ...whatever ChatController expects }
  ask: (payload) =>
    api.post("/api/chat/ask", payload).then((response) => response.data),
};
