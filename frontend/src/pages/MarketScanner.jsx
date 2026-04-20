import { Card } from '../components/ui/Card';
import { Search, Filter, ShieldAlert, ShieldCheck } from 'lucide-react';

const mockSignals = [
  { symbol: 'TSLA', name: 'Tesla Inc.', signal: 'BUY', confidence: 88, risk: 'Medium', price: '$185.20', change: '+2.4%' },
  { symbol: 'NVDA', name: 'Nvidia Corp', signal: 'STRONG BUY', confidence: 94, risk: 'High', price: '$890.10', change: '+5.1%' },
  { symbol: 'AAPL', name: 'Apple Inc.', signal: 'HOLD', confidence: 60, risk: 'Low', price: '$170.50', change: '-0.3%' },
  { symbol: 'MSFT', name: 'Microsoft', signal: 'SELL', confidence: 75, risk: 'Low', price: '$410.20', change: '-1.2%' },
  { symbol: 'AMD', name: 'AMD Inc.', signal: 'BUY', confidence: 82, risk: 'High', price: '$165.80', change: '+3.4%' },
];

export default function MarketScanner() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Market Scanner</h1>
          <p className="text-gray-400 mt-1">Real-time AI generated signals across equity markets.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-48 border border-white/10 rounded-lg overflow-hidden">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
             <input type="text" placeholder="Filter symbol..." className="w-full bg-surface py-2 pl-9 pr-3 text-sm text-white focus:outline-none" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-white/5 border border-white/10 rounded-lg text-sm text-white transition-colors">
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      <Card className="overflow-hidden p-0 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                <th className="p-4 font-bold">Symbol / Asset</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">AI Signal</th>
                <th className="p-4 font-bold hover:text-white cursor-pointer">Confidence â†“</th>
                <th className="p-4 font-bold">Risk Level</th>
                <th className="p-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-200">
              {mockSignals.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="font-bold text-white">{item.symbol}</div>
                    <div className="text-xs text-gray-500">{item.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{item.price}</div>
                    <div className={`text-xs ${item.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>{item.change}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded ${
                      item.signal.includes('BUY') ? 'bg-success/20 text-success border border-success/30' :
                      item.signal.includes('SELL') ? 'bg-danger/20 text-danger border border-danger/30' :
                      'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {item.signal}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${item.confidence > 80 ? 'bg-primary' : 'bg-accent'}`} 
                           style={{ width: `${item.confidence}%` }} 
                         />
                       </div>
                       <span className="font-bold">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {item.risk === 'Low' ? <ShieldCheck size={16} className="text-success" /> : 
                       item.risk === 'High' ? <ShieldAlert size={16} className="text-danger" /> : 
                       <ShieldAlert size={16} className="text-accent" />}
                      {item.risk}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="opacity-0 group-hover:opacity-100 px-4 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-black font-bold rounded transition-all text-xs border border-primary/30 hover:border-primary">
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
