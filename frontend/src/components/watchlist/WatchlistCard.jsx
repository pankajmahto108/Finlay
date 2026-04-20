import React, { useState, useEffect } from 'react';
import { Star, Trash2, GripVertical, AlertTriangle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import StockDetailsModal from './StockDetailsModal';

const WatchlistCard = ({
  symbol,
  viewMode,
  isFavourite,
  onToggleFavourite,
  onRemove,
  provided,
  refreshTrigger // increments every 60s from parent to trigger re-fetch without mounting
}) => {
  const [data, setData] = useState({ quote: null, profile: null, metric: null, sparkline: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Initial load
  useEffect(() => {
    let isMounted = true;

    const fetchStableData = async () => {
      try {
        setIsError(false);
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        const to = Math.floor(Date.now() / 1000);
        const from = to - 30 * 24 * 60 * 60; // 30 days ago

        // Stagger requests to avoid 429 - we'll just wait a tiny random ms based on symbol length to spread them slightly
        await new Promise(r => setTimeout(r, Math.random() * 800));

        const [profileRes, metricRes, candleRes] = await Promise.all([
          fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`),
          fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`),
          fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`)
        ]);

        if (!profileRes.ok || !candleRes.ok) throw new Error("Rate limit / API error");

        const profile = await profileRes.json();
        const metricObj = await metricRes.json();
        const candle = await candleRes.json();

        let targetChart = null;
        if (candle.s === 'ok' && candle.c && candle.c.length > 0) {
          const isPos = candle.c[candle.c.length - 1] >= candle.c[0];
          targetChart = {
            data: candle.c,
            color: isPos ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
          };
        }

        if (isMounted) {
          setData(prev => ({
            ...prev,
            profile: profile,
            metric: metricObj?.metric?.marketCapitalization || 0,
            sparkline: targetChart
          }));
        }
      } catch (err) {
        console.error("WatchlistCard Load Error for", symbol, err);
        if (isMounted) setIsError(true);
      }
    };

    fetchStableData();

    return () => { isMounted = false; };
  }, [symbol]);

  // Repeated load logic (Prices) triggered by parent refreshTrigger
  useEffect(() => {
    let isMounted = true;

    const fetchLivePrice = async () => {
      try {
        setIsError(false);
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
        if (!quoteRes.ok) throw new Error("API Limit");

        const quote = await quoteRes.json();
        if (isMounted) {
          setData(prev => ({ ...prev, quote }));
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) setIsError(true);
      }
    };

    fetchLivePrice();

    return () => { isMounted = false; };
  }, [symbol, refreshTrigger]);

  const formatNumber = (num, isCurrency = false) => {
    if (!num) return '--';
    const n = Number(num);
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return n.toFixed(2);
  };

  const cPrice = data.quote?.c;
  const changePct = data.quote?.dp;
  const isPositive = changePct >= 0;

  // ChartJS config
  const chartConfig = {
    labels: data.sparkline ? data.sparkline.data.map((_, i) => i) : [],
    datasets: [{
      data: data.sparkline ? data.sparkline.data : [],
      borderColor: data.sparkline?.color || '#ccc',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
    animation: false
  };

  if (isError && isLoading) {
    return (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className="bg-gray-800/50 p-4 border border-red-500/30 rounded-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div {...provided?.dragHandleProps} className="cursor-grab text-gray-500"><GripVertical size={16} /></div>
          <AlertTriangle className="text-red-400" size={20} />
          <div className="font-bold">{symbol}</div>
          <div className="text-xs text-red-400 px-2">API Rate Limit Exceeded</div>
        </div>
        <button onClick={onRemove} className="text-gray-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>
      </div>
    );
  }

  if (isLoading) {
    // Skeleton
    return (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className={`bg-gray-800 rounded-xl border border-gray-700 p-4 flex ${viewMode === 'list' ? 'items-center justify-between' : 'flex-col'} animate-pulse gap-4`}
      >
        <div className="flex items-center gap-3 w-1/3">
          <div className="w-4 h-4 bg-gray-700 rounded"></div>
          <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="w-16 h-4 bg-gray-700 rounded"></div>
            <div className="w-24 h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="flex-1 max-w-[120px] h-10 bg-gray-700 rounded px-4"></div>
        <div className="w-20 h-6 bg-gray-700 rounded"></div>
      </div>
    );
  }

  // Loaded Rendering
  const logoUrl = `https://assets.parqet.com/logos/symbol/${symbol.replace(/-.*$/, '')}?format=svg`;

  return (
    <>
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className={`bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors cursor-pointer group ${viewMode === 'list' ? 'flex items-center justify-between p-4' : 'flex flex-col p-5 gap-4 relative'}`}
        onClick={() => setShowModal(true)}
      >
        {/* Left Side / Top Area */}
        <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'w-[250px]' : ''}`}>
          <div {...provided?.dragHandleProps} onClick={e => e.stopPropagation()} className="cursor-grab text-gray-500 hover:text-gray-300 opacity-50 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} />
          </div>
          <img
            src={logoUrl}
            alt={symbol}
            className="w-8 h-8 rounded-full bg-white object-contain border border-gray-600"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-gray-100 text-sm">{symbol}</span>
            <span className="text-xs text-gray-400 truncate w-32">{data.profile?.name || '---'}</span>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className={`h-10 opacity-80 ${viewMode === 'list' ? 'w-[120px]' : 'w-full'} flex items-center justify-center`}>
          {data.sparkline ? (
            <Line data={chartConfig} options={chartOptions} />
          ) : (
            <div className="text-[10px] text-gray-600 border border-dashed border-gray-700 rounded px-2 py-1 w-full text-center">No chart</div>
          )}
        </div>

        {/* Metrics */}
        <div className={`flex ${viewMode === 'list' ? 'items-center justify-end gap-6 flex-1' : 'justify-between items-end border-t border-gray-700/50 pt-3 mt-1'}`}>

          {/* Detailed stats (Hidden in tiny views, visible in list if space allows) */}
          <div className={`hidden md:flex flex-col text-right ${viewMode === 'grid' ? 'hidden' : ''}`}>
            <span className="text-xs text-gray-400">Vol</span>
            <span className="text-xs font-mono">{formatNumber(data.quote?.v)}</span>
          </div>
          <div className={`hidden lg:flex flex-col text-right pr-4 ${viewMode === 'grid' ? 'hidden' : ''}`}>
            <span className="text-xs text-gray-400">M.Cap</span>
            <span className="text-xs font-mono">{formatNumber(data.metric, true)}</span>
          </div>

          <div className="flex flex-col items-end min-w-[70px]">
            <span className="font-mono font-bold text-gray-100">
              ${cPrice?.toFixed(2) || '--'}
            </span>
            {changePct !== undefined && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md mt-1 ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isPositive ? '+' : ''}{changePct?.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        {/* Actions (Absolute in grid, Flex in list) */}
        <div className={`flex items-center gap-1 ${viewMode === 'list' ? 'ml-4 w-[60px] justify-end' : 'absolute top-3 right-3'}`} onClick={e => e.stopPropagation()}>
          <button onClick={onToggleFavourite} className={`p-1.5 rounded-md hover:bg-gray-700 transition ${isFavourite ? 'text-yellow-400' : 'text-gray-500'}`}>
            <Star size={16} fill={isFavourite ? "currentColor" : "none"} />
          </button>
          <button onClick={onRemove} className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-gray-700 transition" title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showModal && (
        <StockDetailsModal
          symbol={symbol}
          profile={data.profile}
          currentPrice={cPrice}
          onClose={() => setShowModal(false)}
          onSetAlert={(sym, price) => console.log('Alert set for', sym, price)}
        />
      )}
    </>
  );
};

export default WatchlistCard;
