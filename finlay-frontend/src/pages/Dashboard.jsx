import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { MiniChart } from '../components/charts/MiniChart';
import { ArrowUpRight, ArrowDownRight, Activity, Wallet, BrainCircuit } from 'lucide-react';

const stats = [
  { label: 'Total Balance', value: '$124,500.00', change: '+2.4%', up: true },
  { label: 'Today\'s P&L', value: '+$1,240.50', change: '+1.1%', up: true },
  { label: 'Active Positions', value: '8', change: '-1', up: false },
  { label: 'AI Confidence Score', value: '92%', change: '+5%', up: true },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back. Here's your portfolio overview.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
          <Activity size={16} className="text-accent" />
          Live Market Mode
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover padding="p-5" className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded bg-surface border ${
                  stat.up ? 'text-success border-success/20' : 'text-danger border-danger/20'
                }`}>
                  {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.change}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <MiniChart color={stat.up ? '#10b981' : '#ef4444'} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-white">Portfolio Performance</h3>
            <div className="flex gap-2 bg-surface rounded-lg p-1 border border-white/5">
              {['1D', '1W', '1M', 'YTD', 'ALL'].map(tf => (
                <button key={tf} className={`px-3 py-1 text-xs font-medium rounded-md ${tf === '1M' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl bg-surface/30">
            {/* Can integrate a full Recharts AreaChart here later */}
            <Activity size={32} className="opacity-50 mb-2" />
            <span>Interactive Chart Component</span>
          </div>
        </Card>

        {/* AI Insights Panel */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit className="text-accent" />
            <h3 className="font-bold text-lg text-white">Qbit Insights</h3>
          </div>
          <div className="space-y-4 flex-1">
            {[
              { id: 1, title: 'NVDA breakout detected', type: 'bullish', prob: '85%' },
              { id: 2, title: 'AAPL approaching resistance', type: 'bearish', prob: '60%' },
              { id: 3, title: 'Unusual volume on TSLA', type: 'neutral', prob: 'High Vol' },
            ].map((insight) => (
              <div key={insight.id} className="p-4 rounded-xl bg-surface border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-200">{insight.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    insight.type === 'bullish' ? 'bg-success/20 text-success' : 
                    insight.type === 'bearish' ? 'bg-danger/20 text-danger' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {insight.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>AI Probability</span>
                  <span className="font-bold text-white">{insight.prob}</span>
                </div>
                <div className="mt-2 h-1 w-full bg-background rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${insight.type === 'bullish' ? 'bg-success' : insight.type === 'bearish' ? 'bg-danger' : 'bg-gray-500'}`} style={{ width: insight.prob.includes('%') ? insight.prob : '50%' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 rounded-xl bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors border border-primary/30">
            View All AI Scans
          </button>
        </Card>
      </div>
    </div>
  );
}
