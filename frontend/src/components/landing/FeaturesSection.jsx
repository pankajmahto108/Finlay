import { motion } from 'framer-motion';
import { 
  Layers, BarChart3, Radar, BrainCircuit, 
  Activity, Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Layers,
    title: 'Create, Backtest & Optimize',
    description: 'Build complex trading strategies with our visual editor. Backtest against years of data and auto-optimize parameters.',
    color: '#00ff66',
  },
  {
    icon: BarChart3,
    title: 'Technical & Fundamental Analysis',
    description: 'Over 200+ indicators, chart patterns, and fundamental data points — all rendered in real-time with institutional precision.',
    color: '#3b82f6',
  },
  {
    icon: Radar,
    title: 'Real-Time Trade Ideas',
    description: 'Our scanner monitors 10,000+ instruments simultaneously, surfacing setups that match your exact criteria in milliseconds.',
    color: '#a855f7',
  },
  {
    icon: BrainCircuit,
    title: 'Train AI Models for Signals',
    description: 'No ML expertise needed. Train predictive models that generate entry/exit signals based on your historical data patterns.',
    color: '#06b6d4',
  },
  {
    icon: Activity,
    title: 'AI-Generated Indicators',
    description: 'Let our AI create custom indicators by learning from price action. Unique signals you won\'t find anywhere else.',
    color: '#f59e0b',
  },
  {
    icon: Sparkles,
    title: 'On-Demand AI Analysis',
    description: 'Ask Qbit to analyze any chart, pattern, or market condition. Get institutional-grade insights in natural language.',
    color: '#ec4899',
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', damping: 15, stiffness: 100 },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-6 lg:px-8">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none" />

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
            <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
            <span className="text-sm font-semibold text-[#3b82f6] tracking-wide">Platform Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Everything You Need{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#3b82f6]">
              In One Place
            </span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Replace your scattered toolchain with a single, intelligent platform that understands how you trade.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative rounded-2xl p-8 border border-white/5 bg-[#0f172a]/40 backdrop-blur-sm hover:border-white/10 transition-all duration-500 cursor-default overflow-hidden"
            >
              {/* Hover glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: feature.color }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  backgroundColor: `${feature.color}10`,
                  borderColor: `${feature.color}20`,
                  boxShadow: 'none',
                }}
              >
                <feature.icon size={28} style={{ color: feature.color }} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
