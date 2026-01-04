import { chatbotReply } from "./ai/chatbot.js";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const form = document.getElementById("chat-form");

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  input.value = "";

  setTimeout(() => {
    const reply = chatbotReply(msg);
    addMessage("bot", reply);
  }, 500);
});
