import React from 'react';

/* Floating chat icon – styled by .chatbot in App.css */
function ChatbotIcon({ onClick }) {
  return (
    <div className="chatbot" onClick={onClick} role="button" title="Chatbot">
      💬
    </div>
  );
}

export default ChatbotIcon;
