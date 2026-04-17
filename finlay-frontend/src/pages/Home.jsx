import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Activity, Globe, Lock, Cpu, BarChart3, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';

const TICKER_DATA = [
  { symbol: 'BTC', price: '$64,230.00', change: '+2.4%', up: true },
  { symbol: 'ETH', price: '$3,450.50', change: '+1.8%', up: true },
  { symbol: 'SOL', price: '$145.20', change: '-0.5%', up: false },
  { symbol: 'SPY', price: '$520.45', change: '+0.3%', up: true },
  { symbol: 'NVDA', price: '$890.10', change: '+4.2%', up: true },
  { symbol: 'AAPL', price: '$178.40', change: '-1.2%', up: false },
  { symbol: 'MSFT', price: '$420.55', change: '+0.8%', up: true },
];

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="w-full space-y-16 pb-24">
      {/* Live Market Ticker */}
      <div className="w-full overflow-hidden bg-surface py-2 border-y border-white/5 flex items-center -mx-6 px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-medium">
              <span className="text-gray-300">{item.symbol}</span>
              <span className="text-white">{item.price}</span>
              <span className={`flex items-center text-xs ${item.up ? 'text-success' : 'text-danger'}`}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-24 px-4 sm:px-6">
        {/* Hero Section */}
        <section className="relative w-full pt-12 pb-20 text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-4xl mx-auto space-y-8 flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-panel border border-accent/20 bg-accent/5 backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-accent text-sm font-semibold tracking-wide uppercase">Introducing Qbit Engine 2.0</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]">
              The Intelligence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white">
                Behind Your Alpha.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl leading-relaxed font-medium">
              Finlay fuses institutional-grade data feeds with an adaptive AI brain. Predict market moves with calculated probability, execute instantly, and scale your portfolio seamlessly.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2 group w-full sm:w-auto text-lg hover:scale-105">
                Launch Platform
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold transition-all w-full sm:w-auto text-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                <Globe size={20} /> Watch Demo
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-12 text-sm text-gray-500 font-medium">
              <p>Trusted by quantitative teams at</p>
              <div className="flex justify-center gap-8 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Mock Logos */}
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-full"/> <span className="font-bold text-xl uppercase tracking-tighter">Onyx</span></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-white rotate-45"/> <span className="font-bold text-xl uppercase tracking-widest">Vertex</span></div>
                <div className="flex items-center gap-2"><div className="w-6 h-6 rounded border-2 border-white"/> <span className="font-bold text-xl uppercase">Nexus Cap</span></div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Statistical Proof Points */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y border-white/5">
          {[
            { value: '$1.2B+', label: 'Volume Scanned' },
            { value: '50ms', label: 'Execution Latency' },
            { value: '94%', label: 'AI Prediction Accuracy' },
            { value: '99.9%', label: 'Platform Uptime' },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4 border-r border-white/5 last:border-0 hover:scale-105 transition-transform cursor-default">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-2 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* Deep Dive EcosystemGrid */}
        <section className="space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white">An Ecosystem of Power</h2>
            <p className="text-gray-400">Everything you need to dominate the markets, built into a single cohesive platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'Qbit Intelligence', desc: 'Probability-based forecasts utilizing DeepSeek and Llama models to analyze sentiment and technicals.' },
              { icon: ShieldCheck, title: 'Risk Parameters', desc: 'Dynamic stop-losses that automatically adjust based on VIX and historical asset volatility.' },
              { icon: Zap, title: 'HFT Simulation', desc: 'Test strategies instantly in our paper trading sandbox before deploying actual capital.' },
              { icon: Activity, title: 'Live Order Flow', desc: 'Direct integration with market makers for institutional level Level 2 order book data.' },
              { icon: Lock, title: 'Enterprise Security', desc: 'Military-grade encryption for all API keys and trading credentials stored in our vaults.' },
              { icon: BarChart3, title: 'Portfolio Analytics', desc: 'Real-time Greeks, Sharpe ratio calculation, and historical performance backtesting.' }
            ].map((feature, i) => (
              <Card key={i} hover padding="p-8" className="group border border-white/5 hover:border-accent/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface to-background border border-white/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all shadow-xl shadow-black/50">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden p-12 lg:p-20 text-center glass-panel border border-accent/20 bg-gradient-to-b from-surface to-background shadow-2xl shadow-accent/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">Ready to trade the future?</h2>
            <p className="text-xl text-gray-400">Join thousands of professional traders who have upgraded their edge with Finlay.</p>
            <button className="px-10 py-5 rounded-2xl bg-white text-background font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all hover:scale-105 animate-pulse-slow">
              Create Free Account
            </button>
            <p className="text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
              <Lock size={14} /> No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-12 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <span className="font-bold text-white text-xs">F</span>
                </div>
                <span className="text-lg font-bold text-white tracking-tight">Finlay</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs">Building the intelligent infrastructure for modern quantitative trading.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-accent transition-colors">Qbit AI</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Market Data</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Paper Trading</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2026 Finlay Technologies Inc. All rights reserved.</p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center">𝕏</div>
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center">in</div>
              <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center">gh</div>
            </div>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-[marquee_20s_linear_infinite] {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </div>
  );
}
