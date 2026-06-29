import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { MessageSquare, Send, Cpu, HelpCircle } from 'lucide-react';

const AiChatbot = () => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = lang === 'en' ? [
    "Which by-product has highest demand this month?",
    "Is there export scope for groundnut oil cake?",
    "Which product is best to sell now for highest profit?"
  ] : [
    "எந்த பொருளை இப்போது விற்றால் அதிக லாபம் கிடைக்கும்?",
    "இந்த மாதத்தின் மார்க்கெட் தேவை எப்படி உள்ளது?",
    "கடலை புண்ணாக்கு ஏற்றுமதி செய்ய என்ன சான்றிதழ்கள் தேவை?"
  ];

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        sender: 'bot',
        text: lang === 'en' ? 
          "Hello! I am your AgriChain AI Smart Market Assistant, powered by Amazon Bedrock. How can I guide you with price predictions or export opportunities today?" :
          "வணக்கம்! நான் உங்கள் அக்ரிசெயின் AI சந்தை உதவியாளர். விலை கணிப்புகள் அல்லது ஏற்றுமதி வாய்ப்புகள் பற்றி இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்?"
      }
    ]);
  }, [lang]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:8080/api/ai/chat?lang=${lang}`, {
        message: text
      });

      // Add bot response
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I am facing connectivity issues to Amazon Bedrock. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card glass-card border-0 shadow-sm overflow-hidden d-flex flex-column" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="card-header bg-success bg-opacity-10 py-3 border-0 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <MessageSquare className="text-success" />
            <h5 className="fw-bold text-success m-0">{t('chatTitle')}</h5>
          </div>
          <span className="badge bg-success">Bedrock Agent Active</span>
        </div>

        {/* Preset suggestions */}
        <div className="px-4 py-2 border-bottom border-secondary border-opacity-10 bg-light bg-opacity-30 d-flex flex-wrap gap-2 align-items-center">
          <HelpCircle size={15} className="text-muted" />
          <span className="text-muted small fw-bold me-1">Suggestions:</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="btn btn-sm btn-outline-success text-start"
              style={{ fontSize: '12px', borderRadius: '20px' }}
              disabled={loading}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Message Window */}
        <div className="card-body overflow-auto d-flex flex-column gap-3 p-4 flex-grow-1" style={{ backgroundColor: 'rgba(240,245,242, 0.2)' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 chat-bubble-${msg.sender === 'user' ? 'user' : 'bot'} shadow-sm`}
              style={{ fontSize: '14.5px', lineHeight: '1.6' }}
            >
              <div className="d-flex align-items-center gap-2 mb-1 opacity-75 small fw-bold">
                {msg.sender === 'user' ? 'You' : 'AgriChain AI'}
              </div>
              <div>{msg.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble-bot p-3 shadow-sm d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
              <Cpu size={16} className="spinner-border spinner-border-sm border-0" />
              <span>{t('aiTyping')}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="card-footer border-0 bg-white p-3 border-top border-secondary border-opacity-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="d-flex gap-2"
          >
            <input
              type="text"
              className="form-control py-2 px-3"
              placeholder={t('chatPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              id="input-chatbot"
            />
            <button type="submit" className="btn btn-success px-4" disabled={loading} id="btn-chatbot-send">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChatbot;
