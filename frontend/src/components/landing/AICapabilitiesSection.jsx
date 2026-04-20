import { motion } from 'framer-motion';
import {
  MessageSquareText, Cpu, Activity, 
  ScanSearch, Zap
} from 'lucide-react';

const capabilities = [
  {
    icon: MessageSquareText,
    title: 'Natural Language Market Analysis',
    description: 'Describe any market scenario in plain English and get detailed analysis with probability-based predictions.',
    color: '#00ff66',
  },
  {
    icon: Cpu,
    title: 'Train ML Models for Signals',
    description: 'Build and train machine learning models to generate buy/sell signals using your own data — no coding required.',
    color: '#3b82f6',
  },
  {
    icon: Activity,
    title: 'Custom Indicator Generation',
    description: 'Let AI create unique technical indicators by learning from your trading style and preferred chart patterns.',
    color: '#a855f7',
  },
  {
    icon: ScanSearch,
    title: 'Pattern Recognition Automation',
    description: 'Automatically detect chart patterns, divergences, and anomalies across every timeframe and instrument.',
    color: '#f59e0b',
  },
  {
    icon: Zap,
    title: 'Real-Time AI Assistance',
    description: 'Qbit is always on. Get instant answers, analysis, and trade suggestions while you browse charts and data.',
    color: '#06b6d4',
  },
];

export default function AICapabilitiesSection() {
  return (
    <section id="ai-capabilities" className="relative py-28 px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050a15] via-[#0a1020] to-[#050a15] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
            <span className="text-sm font-semibold text-[#a855f7] tracking-wide">AI Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Powered by{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#06b6d4]">
              Advanced AI
            </span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            From natural language queries to automated pattern recognition, our AI stack gives you an unfair advantage.
          </p>
        </motion.div>

        {/* Alternating Cards */}
        <div className="space-y-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-2xl p-8 lg:p-10 border border-white/5 bg-[#0f172a]/30 backdrop-blur-sm hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: cap.color }}
              />

              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${cap.color}10`,
                    borderColor: `${cap.color}20`,
                  }}
                >
                  <cap.icon size={32} style={{ color: cap.color }} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed max-w-2xl">
                    {cap.description}
                  </p>
                </div>

                {/* Index number */}
                <div
                  className="text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity absolute top-4 right-8 leading-none"
                  style={{ color: cap.color }}
                >
                  0{i + 1}
                </div>
              </div>

              <div
                className="absolute bottom-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${cap.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
