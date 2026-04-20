import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Loader2 } from 'lucide-react';

const WatchlistSearch = ({ onAdd, existingSymbols }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 1) {
        performSearch(query);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setIsSearching(true);
    setIsOpen(true);
    try {
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
      const response = await fetch(`https://finnhub.io/api/v1/search?q=${encodeURIComponent(searchQuery)}&token=${apiKey}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      // Filter out weird types if necessary, mostly we want Common Stock or Crypto
      // Finnhub sometimes returns empty type or 'Common Stock'.
      setResults((data.result || []).slice(0, 8)); // Top 8 results
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (symbol) => {
    if (existingSymbols.includes(symbol)) {
      alert(`${symbol} is already in your watchlist!`);
      return;
    }
    onAdd(symbol);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md z-50" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks, crypto, ETFs..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-sm placeholder-gray-500"
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center p-4 text-gray-400">
              <Loader2 className="animate-spin mr-2" size={18} />
              <span className="text-sm">Searching markets...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((result, idx) => {
                const isAdded = existingSymbols.includes(result.symbol);
                return (
                  <button
                    key={`${result.symbol}-${idx}`}
                    onClick={() => handleSelect(result.symbol)}
                    className={`flex items-center justify-between p-3 border-b border-gray-700/50 hover:bg-gray-700 transition-colors text-left ${
                      isAdded ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex flex-col overflow-hidden pr-4">
                      <span className="text-sm font-bold text-white truncate">{result.displaySymbol}</span>
                      <span className="text-xs text-gray-400 truncate">{result.description}</span>
                    </div>
                    {isAdded ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-800 px-2 py-1 rounded">Added</span>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors shrink-0">
                        <Plus size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : query.length >= 1 ? (
            <div className="p-4 text-center text-sm text-gray-400">
              No symbols found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default WatchlistSearch;
