import React, { useState, useEffect } from 'react';
import { X, Bell, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockDetailsModal = ({ symbol, profile, currentPrice, onClose, onSetAlert }) => {
  const [timeframe, setTimeframe] = useState('1M'); // 7D, 1M, 3M, 1Y
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertPrice, setAlertPrice] = useState('');

  useEffect(() => {
    fetchDetailedChart();
  }, [timeframe, symbol]);

  const fetchDetailedChart = async () => {
    setIsLoading(true);
    try {
      const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
      const to = Math.floor(Date.now() / 1000);
      let from;
      let resolution = 'D';

      switch (timeframe) {
        case '7D':
          from = to - 7 * 24 * 60 * 60;
          resolution = '60'; // Hourly
          break;
        case '1M':
          from = to - 30 * 24 * 60 * 60;
          break;
        case '3M':
          from = to - 90 * 24 * 60 * 60;
          break;
        case '1Y':
          from = to - 365 * 24 * 60 * 60;
          resolution = 'W'; // Weekly
          break;
        default:
          from = to - 30 * 24 * 60 * 60;
      }

      const res = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`);
      const data = await res.json();

      if (data.s === 'ok') {
        const isPositive = data.c[data.c.length - 1] >= data.c[0];
        const color = isPositive ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'; // green-500 or red-500
        const bgColor = isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)';

        setChartData({
          labels: data.t.map(t => {
            const d = new Date(t * 1000);
            return timeframe === '7D' ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString();
          }),
          datasets: [{
            label: symbol,
            data: data.c,
            borderColor: color,
            backgroundColor: bgColor,
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.1
          }]
        });
      } else {
        setChartData(null);
      }
    } catch (err) {
      console.error("Failed to load detail chart", err);
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = (e) => {
    e.preventDefault();
    if (!alertPrice || isNaN(alertPrice)) return;
    onSetAlert(symbol, parseFloat(alertPrice));
    setAlertPrice('');
    alert(`Alert set for ${symbol} at $${alertPrice}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-3xl border border-gray-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <img
              src={`https://assets.parqet.com/logos/symbol/${symbol.replace(/-.*$/, '')}?format=svg`}
              alt={symbol}
              className="w-10 h-10 rounded-full bg-white object-contain border border-gray-200"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {profile?.name || symbol}
                <span className="text-sm font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded uppercase">{symbol}</span>
              </h2>
              <div className="text-2xl font-bold font-mono text-gray-100 mt-1">
                ${currentPrice?.toFixed(2)}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Chart Controls */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Price History</h3>
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['7D', '1M', '3M', '1Y'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeframe === tf
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Area */}
          <div className="w-full h-64 bg-gray-800/50 rounded-xl border border-gray-800 p-4 relative mb-6">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
              </div>
            ) : chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false }, tooltip: { intersect: false, mode: 'index' } },
                  scales: {
                    x: { display: false },
                    y: {
                      display: true,
                      position: 'right',
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      border: { display: false }
                    }
                  },
                  interaction: { mode: 'nearest', axis: 'x', intersect: false }
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 flex-col gap-2">
                <TrendingDown size={32} className="opacity-50" />
                <span>Chart data unavailable</span>
              </div>
            )}
          </div>

          {/* Alert Setup Box */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Bell size={16} /> Set Price Alert
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Get notified when {symbol} crosses your target price boundary.
            </p>
            <form onSubmit={handleCreateAlert} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  placeholder="Target Price"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Create Alert
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StockDetailsModal;
