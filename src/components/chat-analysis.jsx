import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ChatAnalysisStyle.css';

function ChatAnalysisPage() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const profileData = location.state?.profileData || {};

  // Mensagem inicial baseada no perfil
  useEffect(() => {
    setMessages([{
      id: 1,
      text: `Olá! Vi que você gosta de ${profileData.favoriteGame || 'esports'} e torce para ${profileData.favoriteTeam || 'um time'}. 
             Envie links de sites para eu analisar a relevância para você!`,
      sender: 'bot'
    }]);
  }, [profileData]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
  
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC75bIAI0HTBNHDahvQrI792zYoTg7Pu64`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `O seguinte link é relevante para um fã de ${profileData.favoriteGame || 'esports'} e do time ${profileData.favoriteTeam || 'um time'}? ${inputValue}` }]
            }]
          })
        }
      );
  
      const data = await response.json();
  
      const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "Desculpe, não consegui entender se o site é relevante.";
  
      const botMessage = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot'
      };
  
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Erro na análise:", error);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        text: "Desculpe, ocorreu um erro ao analisar o site.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Análise de Sites Personalizada</h2>
        <p>Envie links para ver se são relevantes para você</p>
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Digite um URL para analisar..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? 'Analisando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

export default ChatAnalysisPage;