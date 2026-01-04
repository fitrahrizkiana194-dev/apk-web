import { processAI } from "./aiEngine.js";

export function chatbotReply(message) {
  return processAI(message);
}
