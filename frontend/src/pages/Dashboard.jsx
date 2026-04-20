import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Search, Bell, User, Activity, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { time: '10:00', price: 180, ma: 182 },
  { time: '10:30', price: 182, ma: 181 },
  { time: '11:00', price: 181, ma: 183 },
  { time: '11:30', price: 185, ma: 184 },
  { time: '12:00', price: 186, ma: 185 },
  { time: '12:30', price: 184, ma: 185 },
  { time: '13:00', price: 188, ma: 186 },
];

export default function Dashboard() {
  const [activeIndicators, setActiveIndicators] = useState(['MA']);

  const toggleIndicator = (ind) => {
    setActiveIndicators(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-8 bg-surface/50 p-4 rounded-2xl glass-panel">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search stock/crypto..." 
            className="w-full bg-background border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-white transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white cursor-pointer hover:scale-110 transition">
            <User size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Chart & Agents */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Chart Section */}
          <Card className="flex flex-col min-h-[450px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <Activity className="text-primary"/> TSLA <span className="text-sm font-normal text-gray-400">Tesla Inc.</span>
                </h3>
              </div>
              <div className="flex gap-2">
                {['MA', 'RSI', 'MACD'].map(ind => (
                  <button 
                    key={ind} 
                    onClick={() => toggleIndicator(ind)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      activeIndicators.includes(ind) ? 'bg-primary/20 text-primary border-primary/50' : 'bg-surface text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff66" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#00ff66" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  {activeIndicators.includes('MA') && (
                    <Area type="monotone" dataKey="ma" stroke="#3b82f6" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Multi-Agent Output Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Market Agent', text: 'Bullish Momentum', status: 'success' },
              { name: 'Sentiment Agent', text: 'Social buzz up 40%', status: 'success' },
              { name: 'Strategy Agent', text: 'Breakout Pattern', status: 'accent' },
              { name: 'Memory Agent', text: 'Matches 12 past trades', status: 'accent' },
              { name: 'Risk Agent', text: 'Low Volatility', status: 'success' },
            ].map((agent, idx) => (
              <Card key={idx} padding="p-3" className="flex flex-col items-center text-center justify-center border-t-2 border-t-primary/50">
                <BrainCircuit size={16} className={`mb-2 ${agent.status === 'success' ? 'text-primary' : 'text-accent'}`} />
                <span className="text-[10px] uppercase font-bold text-gray-400">{agent.name}</span>
                <span className="text-xs font-semibold text-white mt-1">{agent.text}</span>
              </Card>
            ))}
          </div>

        </div>

        {/* Right Col: AI Insights Panel & Final Decision */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-gradient-to-b from-surface to-background">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <Zap className="text-primary" />
              <h3 className="font-bold text-lg text-white">Qbit AI Analysis</h3>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="text-xs text-gray-400 mb-1">Market Analysis</div>
                <div className="text-sm text-gray-200">TSLA is showing strong upward momentum based on recent D1 support bounce.</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Sentiment</div>
                <div className="text-sm text-gray-200">Overwhelmingly positive driven by recent earnings beat and retail volume.</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Strategy Suggestion</div>
                <div className="text-sm text-gray-200">Enter long position. Target: $195. Stop loss: $178.</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-background rounded-lg border border-white/5">
                  <div className="text-[10px] uppercase text-gray-500 mb-1 block">Risk Level</div>
                  <div className="text-success font-bold text-sm flex items-center gap-1"><ShieldCheck size={14}/> LOW</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-white/5">
                  <div className="text-[10px] uppercase text-gray-500 mb-1 block">AI Confidence</div>
                  <div className="text-white font-bold text-sm">88%</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Qbit Final Decision Box */}
          <div className="glow-box flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary w-full to-transparent"></div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Qbit Final Decision</h4>
            <div className="text-5xl font-black text-white mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,102,0.5)]">BUY</div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
              Multiple agents confirm bullish breakout potential. Memory vector matching shows 88% historical win rate for identical setups.
            </p>
            <button className="mt-6 px-6 py-2.5 bg-primary hover:bg-primaryHover text-black font-bold rounded-lg transition-transform hover:scale-105 shadow-[0_0_15px_rgba(0,255,102,0.4)]">
              Execute Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
