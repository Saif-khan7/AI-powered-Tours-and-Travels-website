import React, { useState } from 'react';
import axios from 'axios';
import './ChatbotWindow.css'; // Optional: for styling

function ChatbotWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your travel assistant. Ask me anything about travel.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botMsg = { sender: 'bot', text: res.data.reply || "Sorry, I didn't get that." };
      setMessages((msgs) => [...msgs, botMsg]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error connecting to chatbot.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <span>Travel Chatbot</span>
        <button onClick={onClose}>×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="chatbot-msg bot">Typing...</div>}
      </div>
      <div className="chatbot-input">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about travel..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default ChatbotWindow;
