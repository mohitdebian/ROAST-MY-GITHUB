
import React, { useState, useEffect } from 'react';
import { Search, Flame, ArrowRight, History, Trash2 } from 'lucide-react';
import { RoastHistoryItem } from '../types';

interface RoastInputProps {
  onRoast: (username: string) => void;
  isLoading: boolean;
  historyUpdated: number; // Prop to trigger re-render of history
}

const RoastInput: React.FC<RoastInputProps> = ({ onRoast, isLoading, historyUpdated }) => {
  const [username, setUsername] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<RoastHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gitroast_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, [historyUpdated]); // Re-fetch when parent signals update

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onRoast(username.trim());
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('gitroast_history');
    setHistory([]);
  };

  return (
    <div className={`w-full max-w-xl mx-auto transition-all duration-500 flex flex-col items-center ${isLoading ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}`}>
      <form onSubmit={handleSubmit} className="relative group z-20 w-full">
        
        {/* Glow Effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-fire-600 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 ${isFocused ? 'opacity-100' : ''}`}></div>
        
        {/* Input Container */}
        <div className="relative flex items-center bg-gray-900 rounded-xl p-2 transition-all duration-300">
          
          {/* Prefix */}
          <div className="pl-4 pr-2 text-gray-500 select-none flex items-center gap-2">
            <Search size={18} className={isFocused ? 'text-fire-500' : ''} />
            <span className="font-mono text-gray-600">github.com/</span>
          </div>
          
          {/* Input Field */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="username"
            className="w-full bg-transparent text-white py-3 text-lg font-mono outline-none placeholder-gray-700"
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !username}
            className="ml-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
             <span className="hidden sm:inline">DESTROY</span>
             <Flame size={18} className="sm:hidden text-fire-500" />
             <ArrowRight size={18} className="hidden sm:inline" />
          </button>
        </div>
      </form>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-12 w-full animate-slide-up">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest">
              <History size={12} />
              <span>Recent Losers</span>
            </div>
            <button onClick={clearHistory} className="text-gray-700 hover:text-red-500 transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.slice(0, 4).map((item, idx) => (
              <button
                key={`${item.username}-${idx}`}
                onClick={() => onRoast(item.username)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group text-left"
              >
                <img src={item.avatar_url} alt={item.username} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-gray-400 group-hover:text-white truncate">@{item.username}</div>
                  <div className={`text-xs font-bold ${item.score > 70 ? 'text-fire-500' : item.score > 30 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {item.score}% BAD
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-700 group-hover:text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoastInput;
