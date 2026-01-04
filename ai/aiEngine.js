import knowledgeBase from "./knowledge.js";

function calculateScore(message, keywords) {
  let score = 0;
  keywords.forEach(word => {
    if (message.includes(word)) score++;
  });
  return score;
}

export function processAI(userMessage) {
  const message = userMessage.toLowerCase();
  let bestScore = 0;
  let bestResponse =
    "Untuk informasi yang lebih akurat, disarankan berkonsultasi langsung dengan tenaga medis.";

  knowledgeBase.forEach(item => {
    const score = calculateScore(message, item.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestResponse = item.response;
    }
  });

  return bestResponse;
}
