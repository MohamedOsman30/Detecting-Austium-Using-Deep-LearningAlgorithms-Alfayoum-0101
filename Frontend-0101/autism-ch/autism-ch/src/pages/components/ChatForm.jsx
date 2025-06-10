import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    // Update chat history with the user's message
    setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

    // Immediately show "Thinking..." placeholder for the bot's response
    setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

    // Generate the bot's response after submitting the user message
    generateBotResponse(userMessage);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" id="send-message" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
