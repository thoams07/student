import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
}

interface ChatViewProps {
  chatMessages: ChatMessage[];
  onSendMessage: (query: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ chatMessages, onSendMessage }) => {
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;
    onSendMessage(inputQuery);
    setInputQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Ask My LMS AI Assistant</h3>
            <p className="text-[10px] text-slate-500">Query engine with verified database grounding</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
          Grounding: 100% LMS Records
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>

            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1 text-[9px] text-slate-400">
                <span>Sources:</span>
                {msg.sources.map((s, i) => (
                  <span key={i} className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                    {s}
                  </span>
                ))}
              </div>
            )}
            <span className="text-[9px] text-slate-400 mt-1">{msg.timestamp}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-slate-100 bg-slate-50/70 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-slate-400 text-[10px] pl-2 font-medium">Try:</span>
        {[
          'What is due tomorrow?',
          'Why is OS high risk?',
          'Show deadline changes this week',
          'How many hours of work are pending?'
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              onSendMessage(prompt);
            }}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 whitespace-nowrap text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Ask a question about assignments, risk, or schedules..."
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-600"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};