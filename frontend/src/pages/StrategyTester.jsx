import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Play, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockResults = [
  { time: '1', balance: 10000 },
  { time: '2', balance: 10250 },
  { time: '3', balance: 10100 },
  { time: '4', balance: 10800 },
  { time: '5', balance: 11500 },
];

export default function StrategyTester() {
  const [isTesting, setIsTesting] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setHasResults(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Strategy Tester</h1>
        <p className="text-gray-400 mt-1">Backtest your trading ideas using Historical Market Data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Setup Panel */}
        <Card className="lg:col-span-1 border border-white/5 bg-surface/50 p-6 space-y-6 flex flex-col h-fit">
          <h3 className="font-bold text-lg text-white border-b border-white/10 pb-4">Strategy Parameters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Indicator Setup</label>
              <select className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary/50 outline-none">
                <option>MACD Crossover</option>
                <option>RSI Oversold/Overbought</option>
                <option>Bollinger Bands Breakout</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Timeframe</label>
              <select className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary/50 outline-none">
                <option>1 Hour</option>
                <option>4 Hours</option>
                <option>1 Day</option>
                <option>1 Week</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Asset Symbol</label>
              <input type="text" defaultValue="BTC/USD" className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary/50 outline-none" />
            </div>

            <button 
              onClick={handleTest}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primaryHover text-black font-bold rounded-lg transition-transform hover:scale-105"
            >
              <Play size={18} fill="currentColor" />
              {isTesting ? 'Running...' : 'Run Backtest'}
            </button>
          </div>
        </Card>

        {/* Right Col: Results */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="min-h-[350px] relative overflow-hidden flex flex-col justify-center">
            {!hasResults && !isTesting && (
              <div className="text-center text-gray-500 flex flex-col items-center">
                <Activity size={48} className="mb-4 opacity-50" />
                <p>Configure parameters and run the backtest to view portfolio simulation.</p>
              </div>
            )}
            {isTesting && (
              <div className="text-center text-primary flex flex-col items-center animate-pulse">
                <Clock size={48} className="mb-4" />
                <p>Simulating 5 years of historical data...</p>
              </div>
            )}
            {hasResults && !isTesting && (
              <div className="w-full h-full animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-white">Backtest Equity Curve</h3>
                  <div className="px-3 py-1 bg-success/20 text-success rounded font-bold text-xl">+15.0% Net Profit</div>
                </div>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockResults}>
                      <defs>
                        <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" hide />
                      <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                      <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fill="url(#colorEq)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </Card>

          {hasResults && (
            <Card className="animate-in slide-in-from-bottom-4 duration-700">
              <h3 className="font-bold text-lg text-white mb-4 border-b border-white/10 pb-4">Recent Simulated Trades</h3>
              <div className="space-y-3">
                {[
                  { type: 'BUY', price: '$24,500', profit: '+$1,200', pnl: 'up', time: 'Oct 12, 10:30' },
                  { type: 'SELL', price: '$25,700', profit: '-$150', pnl: 'down', time: 'Oct 14, 14:15' },
                  { type: 'BUY', price: '$25,400', profit: '+$2,100', pnl: 'up', time: 'Oct 18, 09:00' },
                ].map((trade, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-background border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${trade.type === 'BUY' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {trade.type === 'BUY' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{trade.type} BTC/USD</div>
                        <div className="text-xs text-gray-500">{trade.time} @ {trade.price}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${trade.pnl === 'up' ? 'text-success' : 'text-danger'}`}>
                      {trade.profit}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
