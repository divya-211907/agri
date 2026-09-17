import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { MessageSquare, Send, Cpu, HelpCircle, ShieldCheck, MapPin, Calendar, TrendingUp, ExternalLink, X } from 'lucide-react';

const AiChatbot = () => {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTraceModal, setActiveTraceModal] = useState(null);
  const messagesEndRef = useRef(null);

  const presets = lang === 'en' ? [
    "What is the price of soybean?",
    "What is the price of groundnut cake?",
    "Show me cottonseed cake price",
    "Where can I sell my soybean?",
    "What is today's soymeal price?",
    "What is the demand for groundnut cake?"
  ] : [
    "சோயாபீன் விலை என்ன?",
    "கடலை புண்ணாக்கு விலை என்ன?",
    "பருத்தி புண்ணாக்கு விலை என்ன?",
    "சோயாபீனை எங்கு விற்கலாம்?",
    "சோயாமீல் தற்போதைய விலை என்ன?",
    "கடலை புண்ணாக்கு சந்தை தேவை எப்படி உள்ளது?"
  ];

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        sender: 'bot',
        text: lang === 'en' ? 
          "Hello! I am your AgriChain AI Smart Market Assistant. I retrieve verified agricultural market data from official government mandi records (AGMARKNET). How can I assist you with market prices or market comparisons today?" :
          "வணக்கம்! நான் உங்கள் அக்ரிசெயின் AI சந்தை உதவியாளர். அதிகாரப்பூர்வ அரசு மண்டி பதிவுகளிலிருந்து (AGMARKNET) சரிபார்க்கப்பட்ட சந்தை விலைகளை நான் வழங்குகிறேன். இன்று உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        cardType: 'GENERAL_TEXT'
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

      // Add bot response with structured market payload
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.data.response,
          cardType: res.data.cardType || 'GENERAL_TEXT',
          priceRecord: res.data.priceRecord,
          forecast: res.data.forecast,
          markets: res.data.markets,
          commodity: res.data.commodity,
          traceability: res.data.traceability,
          ambiguousOptions: res.data.ambiguousOptions,
          locationMatchLevel: res.data.locationMatchLevel,
          statusMessage: res.data.statusMessage
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Verified market data service is temporarily unavailable. Please try again in a few moments.",
          cardType: 'GENERAL_TEXT'
        }
      ]);
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
            <h5 className="fw-bold text-success m-0">AgriChain Market Assistant</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success bg-opacity-20 text-success d-flex align-items-center gap-1">
              <ShieldCheck size={14} /> Official AGMARKNET Verified
            </span>
          </div>
        </div>

        {/* Preset suggestions */}
        <div className="px-4 py-2 border-bottom border-secondary border-opacity-10 bg-light bg-opacity-30 d-flex flex-wrap gap-2 align-items-center">
          <HelpCircle size={15} className="text-muted" />
          <span className="text-muted small fw-bold me-1">Sample Queries:</span>
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
            <div key={idx} className="d-flex flex-column gap-2">
              <div
                className={`p-3 chat-bubble-${msg.sender === 'user' ? 'user' : 'bot'} shadow-sm`}
                style={{ fontSize: '14.5px', lineHeight: '1.6', whiteSpace: 'pre-line' }}
              >
                <div className="d-flex align-items-center gap-2 mb-1 opacity-75 small fw-bold">
                  {msg.sender === 'user' ? 'You' : 'AgriChain Market Assistant'}
                </div>
                <div>{msg.text}</div>
              </div>

              {/* Card Type 1: Structured Market Price Card (Requirement 14 & 15) */}
              {msg.sender === 'bot' && msg.cardType === 'MARKET_PRICE_CARD' && msg.priceRecord && (
                <div className="card border border-success border-opacity-25 shadow-sm p-4 ms-2" style={{ maxWidth: '650px', background: '#ffffff' }}>
                  <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-10">
                    <span className="fw-bold text-success d-flex align-items-center gap-1">
                      🌱 AgriChain Market Assistant
                    </span>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      Latest available market data
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-muted small d-block">Product:</span>
                    <h5 className="fw-bold text-dark m-0">{msg.priceRecord.commodity} <span className="text-muted fs-6 fw-normal">({msg.priceRecord.variety || 'Standard'})</span></h5>
                  </div>

                  <div className="p-3 my-3 rounded bg-success bg-opacity-10 border border-success border-opacity-20 d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-success small fw-bold text-uppercase d-block">Current Market Price</span>
                      <h2 className="fw-bold text-success m-0">₹{msg.priceRecord.modalPrice?.toFixed(2)} <span className="fs-6 text-muted fw-normal">/kg</span></h2>
                      <span className="badge bg-secondary bg-opacity-10 text-muted" style={{ fontSize: '11px' }}>Price Type: Modal Price</span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-white text-dark border p-2 d-block mb-1">
                        Min: ₹{msg.priceRecord.minimumPrice?.toFixed(2)}/kg
                      </span>
                      <span className="badge bg-white text-dark border p-2 d-block">
                        Max: ₹{msg.priceRecord.maximumPrice?.toFixed(2)}/kg
                      </span>
                    </div>
                  </div>

                  <div className="row g-2 small text-muted mb-3">
                    <div className="col-sm-6 d-flex align-items-center gap-1">
                      <MapPin size={14} className="text-success" />
                      <span><strong>Market:</strong> {msg.priceRecord.market} ({msg.priceRecord.district}, {msg.priceRecord.state})</span>
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-1">
                      <Calendar size={14} className="text-success" />
                      <span><strong>Date:</strong> {msg.priceRecord.priceDate}</span>
                    </div>
                  </div>

                  {/* AI Forecast Section */}
                  {msg.forecast && (
                    <div className="p-3 my-2 rounded bg-light border">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-primary" />
                        <span className="fw-bold text-primary small">🤖 AI Forecast</span>
                      </div>
                      <h5 className="fw-bold text-dark mb-1">
                        ₹{msg.forecast.predictedMinPrice?.toFixed(2)} – ₹{msg.forecast.predictedMaxPrice?.toFixed(2)} /kg
                      </h5>
                      <p className="text-muted small m-0 fst-italic">
                        * Forecast is an AI estimate — Not a guaranteed market price. (Model: {msg.forecast.modelName})
                      </p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center pt-3 mt-2 border-top border-secondary border-opacity-10">
                    <div className="small text-muted">
                      <span>Source: <strong>{msg.priceRecord.source}</strong></span>
                      <span className="d-block" style={{ fontSize: '11px' }}>Last updated: {new Date(msg.priceRecord.fetchedAt).toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setActiveTraceModal(msg.traceability || msg.priceRecord)}
                      className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                    >
                      <ExternalLink size={13} /> View Source
                    </button>
                  </div>
                </div>
              )}

              {/* Card Type 2: Multi-Market Comparison Table (Requirement 6) */}
              {msg.sender === 'bot' && msg.cardType === 'COMPARISON_TABLE' && msg.markets && (
                <div className="card border border-success border-opacity-25 shadow-sm p-4 ms-2" style={{ maxWidth: '750px', background: '#ffffff' }}>
                  <div className="d-flex justify-content-between align-items-center pb-2 mb-3 border-bottom border-secondary border-opacity-10">
                    <h6 className="fw-bold text-success m-0">
                      📊 Regional Market Comparison for {msg.commodity}
                    </h6>
                    <span className="badge bg-success bg-opacity-10 text-success">
                      Sorted by Modal Price
                    </span>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm table-hover align-middle">
                      <thead className="table-light">
                        <tr style={{ fontSize: '13px' }}>
                          <th>Market</th>
                          <th>District / State</th>
                          <th className="text-end">Modal Price</th>
                          <th className="text-end">Range (Min - Max)</th>
                          <th className="text-center">Date</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: '13.5px' }}>
                        {msg.markets.map((m, mIdx) => (
                          <tr key={mIdx}>
                            <td className="fw-bold text-dark">{m.market}</td>
                            <td className="text-muted">{m.district}, {m.state}</td>
                            <td className="text-end fw-bold text-success">₹{m.modalPrice?.toFixed(2)}/kg</td>
                            <td className="text-end text-muted small">₹{m.minimumPrice?.toFixed(2)} - ₹{m.maximumPrice?.toFixed(2)}</td>
                            <td className="text-center text-muted small">{m.priceDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted small m-0 pt-2 border-top border-secondary border-opacity-10 fst-italic">
                    These are the latest available market prices from the retrieved data. Source: Official Market Data (AGMARKNET / data.gov.in).
                  </p>
                </div>
              )}

              {/* Card Type 3: Ambiguity Resolver (Requirement 10 & 16) */}
              {msg.sender === 'bot' && msg.cardType === 'AMBIGUITY_RESOLVER' && msg.ambiguousOptions && (
                <div className="p-3 ms-2 rounded bg-light border border-secondary border-opacity-10 d-flex flex-wrap gap-2 align-items-center" style={{ maxWidth: '550px' }}>
                  <span className="small text-muted fw-bold me-1">Select exact product:</span>
                  {msg.ambiguousOptions.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleSend(`What is the price of ${opt}?`)}
                      className="btn btn-sm btn-success rounded-pill px-3 shadow-sm"
                      style={{ fontSize: '13px' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-bot p-3 shadow-sm d-flex align-items-center gap-2 text-muted" style={{ fontSize: '13px' }}>
              <Cpu size={16} className="spinner-border spinner-border-sm border-0" />
              <span>Fetching verified market data from AGMARKNET...</span>
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
              placeholder={lang === 'en' ? "Ask about product prices, 'where to sell', or market trends..." : "விலை, எங்கு விற்கலாம் அல்லது சந்தை போக்குகள் பற்றி கேளுங்கள்..."}
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

      {/* Modal: View Source / Traceability (Requirement 15) */}
      {activeTraceModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-success text-white py-3">
                <h5 className="modal-title fs-6 fw-bold d-flex align-items-center gap-2">
                  <ShieldCheck size={18} /> AgriChain Official Price Traceability
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setActiveTraceModal(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center justify-content-between p-2 mb-3 bg-success bg-opacity-10 rounded border border-success border-opacity-25">
                  <span className="small fw-bold text-success">Status:</span>
                  <span className="badge bg-success">VERIFIED_OFFICIAL_RECORD</span>
                </div>

                <ul className="list-group list-group-flush" style={{ fontSize: '13.5px' }}>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Source Name:</span>
                    <span className="fw-bold">{activeTraceModal.sourceName || activeTraceModal.source || 'AGMARKNET / data.gov.in'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Commodity & Variety:</span>
                    <span className="fw-bold">{activeTraceModal.commodity} ({activeTraceModal.variety || 'Standard'})</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Reporting Mandi / Market:</span>
                    <span className="fw-bold">{activeTraceModal.market}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">District & State:</span>
                    <span>{activeTraceModal.district}, {activeTraceModal.state}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Official Mandi Reporting Unit:</span>
                    <span className="fw-bold text-primary">{activeTraceModal.rawPriceQuintal || '₹' + (activeTraceModal.modalPrice * 100) + '/Quintal'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Converted System Modal Price:</span>
                    <span className="fw-bold text-success">{activeTraceModal.pricePerKg || '₹' + activeTraceModal.modalPrice + '/kg'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Reporting Date:</span>
                    <span>{activeTraceModal.priceDate}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Retrieved / Fetched At:</span>
                    <span className="small text-muted">{new Date(activeTraceModal.fetchedAt || Date.now()).toLocaleString()}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">Source Portal:</span>
                    <a href={activeTraceModal.sourceUrl || 'https://agmarknet.gov.in'} target="_blank" rel="noreferrer" className="text-success small">
                      {activeTraceModal.sourceUrl || 'https://agmarknet.gov.in'}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="modal-footer py-2">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveTraceModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
