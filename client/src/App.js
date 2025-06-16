import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setError(null);
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      if (!res.ok) throw new Error('Failed to get AI response');
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-center py-6 px-2">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl bg-white/80 backdrop-blur-md border border-indigo-200 flex flex-col h-[80vh]">
        <div className="flex items-center justify-between px-8 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-200/60 to-pink-200/60 rounded-t-3xl">
          <h1 className="text-2xl font-extrabold text-indigo-700 tracking-wide drop-shadow">NovaBot</h1>
          <span className="text-xs text-pink-600 font-semibold bg-pink-100 px-3 py-1 rounded-full">AI Assistant</span>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-pink-100 text-indigo-800 rounded-bl-none'} font-medium text-base`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-2xl shadow bg-pink-100 text-indigo-400 font-medium text-base animate-pulse">
                NovaBot is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="px-6 py-4 border-t border-indigo-100 bg-white/70 rounded-b-3xl flex items-center gap-3">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-2xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/90 text-indigo-900 placeholder:text-indigo-300 shadow"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-indigo-500 to-pink-400 text-white px-6 py-2 rounded-2xl font-bold shadow hover:from-indigo-600 hover:to-pink-500 transition-all duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {error && (
          <div className="text-center text-red-500 text-sm py-2">{error}</div>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default App;
