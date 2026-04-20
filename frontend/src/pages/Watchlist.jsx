import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import WatchlistSearch from '../components/watchlist/WatchlistSearch';
import WatchlistCard from '../components/watchlist/WatchlistCard';
import { LayoutGrid, List, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const Watchlist = () => {
  // State from LocalStorage
  const [watchlist, setWatchlist] = useState([]);
  const [favourites, setFavourites] = useState([]);
  
  // UI State
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [isFavsOpen, setIsFavsOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [countdown, setCountdown] = useState(60);

  // Initialize from LocalStorage
  useEffect(() => {
    const storedWl = localStorage.getItem('finlay_watchlist');
    const storedFavs = localStorage.getItem('finlay_favourites');
    
    if (storedWl) setWatchlist(JSON.parse(storedWl));
    else setWatchlist(['AAPL', 'TSLA', 'MSFT', 'NVDA']); // Default suggested

    if (storedFavs) setFavourites(JSON.parse(storedFavs));
    else setFavourites(['BINANCE:BTCUSDT']); 
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('finlay_watchlist', JSON.stringify(watchlist));
    localStorage.setItem('finlay_favourites', JSON.stringify(favourites));
  }, [watchlist, favourites]);

  // Interval for Refresh every 60s
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setRefreshTrigger(t => t + 1);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setRefreshTrigger(t => t + 1);
    setCountdown(60);
  };

  const handleAddStock = (symbol) => {
    if (!watchlist.includes(symbol) && !favourites.includes(symbol)) {
      setWatchlist(prev => [symbol, ...prev]);
    }
  };

  const handleRemove = (symbol) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
    setFavourites(prev => prev.filter(s => s !== symbol));
  };

  const handleToggleFavourite = (symbol) => {
    if (favourites.includes(symbol)) {
      setFavourites(prev => prev.filter(s => s !== symbol));
      setWatchlist(prev => [symbol, ...prev]); // Move to regular
    } else {
      setWatchlist(prev => prev.filter(s => s !== symbol));
      setFavourites(prev => [symbol, ...prev]); // Move to favs
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within same list
      const list = source.droppableId === 'favorites' ? [...favourites] : [...watchlist];
      const [removed] = list.splice(source.index, 1);
      list.splice(destination.index, 0, removed);
      
      if (source.droppableId === 'favorites') setFavourites(list);
      else setWatchlist(list);
    } else {
      // Moving between lists
      const sourceList = source.droppableId === 'favorites' ? [...favourites] : [...watchlist];
      const destList = destination.droppableId === 'favorites' ? [...favourites] : [...watchlist];
      
      const [removed] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, removed);
      
      if (source.droppableId === 'favorites') {
        setFavourites(sourceList);
        setWatchlist(destList);
      } else {
        setWatchlist(sourceList);
        setFavourites(destList);
      }
    }
  };

  // UI rendering helper for lists
  const renderList = (items, droppableId) => (
    <Droppable droppableId={droppableId} direction={viewMode === 'list' ? 'vertical' : 'horizontal'}>
      {(provided) => (
        <div 
          ref={provided.innerRef} 
          {...provided.droppableProps}
          className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-2'}`}
        >
          {items.map((symbol, index) => (
            <Draggable key={symbol} draggableId={symbol} index={index}>
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={provided.draggableProps.style}  // Very important for DND scaling to not crash
                >
                  <WatchlistCard 
                    symbol={symbol} 
                    viewMode={viewMode}
                    isFavourite={droppableId === 'favorites'}
                    onToggleFavourite={() => handleToggleFavourite(symbol)}
                    onRemove={() => handleRemove(symbol)}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-gray-100 overflow-y-auto overflow-x-hidden p-4 md:p-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Market Watchlist</h1>
          <p className="text-sm text-gray-400 mt-1">Track and manage your asset portfolio</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <WatchlistSearch 
            onAdd={handleAddStock} 
            existingSymbols={[...watchlist, ...favourites]} 
          />
          
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button 
            onClick={handleManualRefresh}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition"
          >
            <RefreshCw size={16} className={`${countdown === 60 ? 'animate-spin' : ''} text-blue-400`} />
            <span className="hidden sm:inline">{countdown}s</span>
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Favourites Section */}
        {favourites.length > 0 && (
          <div className="mb-8">
            <button 
              onClick={() => setIsFavsOpen(!isFavsOpen)}
              className="flex items-center gap-2 text-yellow-400 font-semibold mb-4 hover:opacity-80 transition"
            >
              {isFavsOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
              Favourites ({favourites.length})
            </button>
            
            {isFavsOpen && renderList(favourites, 'favorites')}
          </div>
        )}

        {/* Standard Watchlist Section */}
        <div>
          <h2 className="text-gray-400 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center justify-between">
            Your Watchlist ({watchlist.length})
          </h2>
          
          {watchlist.length === 0 && favourites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-800/20 rounded-xl border border-gray-800 border-dashed">
              <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
              <div className="flex gap-2">
                {['AAPL', 'TSLA', 'BTC-USD'].map(sym => (
                  <button 
                    key={sym} 
                    onClick={() => handleAddStock(sym)}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm text-blue-400 transition"
                  >
                    + Add {sym}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            renderList(watchlist, 'watchlist')
          )}
        </div>
      </DragDropContext>

      <div className="mt-12 pt-6 border-t border-gray-800/50">
         <h3 className="text-xs uppercase font-bold text-gray-500 mb-3 tracking-wider">Trending Today</h3>
         <div className="flex flex-wrap gap-2">
            {['NVDA', 'AMD', 'SPY', 'QQQ'].map(sym => (
               <button 
                  key={sym}
                  onClick={() => handleAddStock(sym)}
                  className="px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition"
               >
                  {sym}
               </button>
            ))}
         </div>
      </div>

    </div>
  );
};

export default Watchlist;
