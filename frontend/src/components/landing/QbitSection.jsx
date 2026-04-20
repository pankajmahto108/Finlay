import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, ArrowRight, Cpu, Shield, Globe, Zap, MessageSquare } from 'lucide-react';

const agents = [
  { icon: Cpu, name: 'Market Analyst', desc: 'Real-time price & volume analysis', color: '#00ff66' },
  { icon: Shield, name: 'Risk Manager', desc: 'Dynamic stop-loss & position sizing', color: '#ef4444' },
  { icon: Globe, name: 'News Agent', desc: 'Sentiment from 1000+ sources', color: '#3b82f6' },
  { icon: Zap, name: 'Strategy Agent', desc: 'Pattern recognition & backtesting', color: '#f59e0b' },
  { icon: MessageSquare, name: 'Technical Agent', desc: 'Indicators & chart patterns', color: '#a855f7' },
];

export default function QbitSection() {
  return (
    <section id="qbit-section" className="relative py-28 px-6 lg:px-8 overflow-hidden">
      {/* Large glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#00ff66]/5 blur-[200px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00ff66]/20 bg-[#00ff66]/5 backdrop-blur-xl">
              <BrainCircuit size={16} className="text-[#00ff66]" />
              <span className="text-sm font-semibold text-[#00ff66] tracking-wide">Core Intelligence</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.1]">
              Meet{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#06b6d4]">
                Qbit
              </span>
              <br />
              Your AI Trading Brain
            </h2>

            <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
              Qbit isn't a simple chatbot — it's a full-scale LLM system powered by multiple specialized agents. Ask anything about markets, strategies, or portfolio management and get institutional-grade analysis in seconds.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/qbit"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#06b6d4] text-white font-bold text-lg flex items-center gap-2 hover:shadow-[0_0_40px_rgba(0,255,102,0.3)] transition-all hover:scale-105"
              >
                Explore Qbit
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#ai-capabilities"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#ai-capabilities')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-sm"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right — Agent Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Central Brain */}
            <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full border border-[#00ff66]/10" />

              {/* Brain center */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-[#00ff66] to-[#06b6d4] flex items-center justify-center shadow-[0_0_60px_rgba(0,255,102,0.3)]"
              >
                <BrainCircuit size={48} className="text-[#050a15]" />
                <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '3s' }} />
              </motion.div>

              {/* Agent Nodes */}
              {agents.map((agent, i) => {
                const angle = (i * 360) / agents.length - 90;
                const rad = (angle * Math.PI) / 180;
                const radius = 42; // percentage from center
                const x = 50 + radius * Math.cos(rad);
                const y = 50 + radius * Math.sin(rad);

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
                    className="absolute group"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Connection line */}
                    <svg
                      className="absolute pointer-events-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: '200px',
                        height: '200px',
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <line
                        x1="100"
                        y1="100"
                        x2={100 + (50 - x) * 2}
                        y2={100 + (50 - y) * 2}
                        stroke={`${agent.color}30`}
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />
                    </svg>

                    {/* Node */}
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center border backdrop-blur-sm cursor-default transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${agent.color}10`,
                        borderColor: `${agent.color}25`,
                        boxShadow: `0 0 20px ${agent.color}10`,
                      }}
                    >
                      <agent.icon size={24} style={{ color: agent.color }} />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      <div className="px-3 py-2 rounded-lg bg-[#0f172a] border border-white/10 text-center">
                        <div className="text-xs font-bold text-white">{agent.name}</div>
                        <div className="text-[10px] text-gray-400">{agent.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
