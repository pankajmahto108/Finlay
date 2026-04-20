import { motion } from 'framer-motion';
import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

const useCases = [
  {
    icon: BarChart3,
    title: 'Algorithmic Trading',
    description: 'Build, test, and deploy automated strategies with AI-powered signal generation and risk management.',
    stats: [
      { label: 'Avg. return improvement', value: '+34%' },
      { label: 'Strategies running daily', value: '2,400+' },
    ],
    color: '#00ff66',
    gradient: 'from-[#00ff66]/20 to-transparent',
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Investing',
    description: 'AI-driven portfolio analysis, rebalancing suggestions, and fundamental deep dives for buy-and-hold investors.',
    stats: [
      { label: 'Portfolio accuracy', value: '91%' },
      { label: 'Assets analyzed', value: '50K+' },
    ],
    color: '#3b82f6',
    gradient: 'from-[#3b82f6]/20 to-transparent',
  },
  {
    icon: Clock,
    title: 'Intraday Trading',
    description: 'Real-time scanners, instant AI analysis, and sub-second execution for day traders who need speed.',
    stats: [
      { label: 'Signal latency', value: '<50ms' },
      { label: 'Daily signals generated', value: '10K+' },
    ],
    color: '#f59e0b',
    gradient: 'from-[#f59e0b]/20 to-transparent',
  },
];

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="relative py-28 px-6 lg:px-8">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050a15] via-[#080e1e] to-[#050a15] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="text-sm font-semibold text-[#f59e0b] tracking-wide">Use Cases</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Built For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#ef4444]">
              Every Trader
            </span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Whether you're a quant, swing trader, or long-term investor — Finlay adapts to your strategy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-white/5 bg-[#0f172a]/40 backdrop-blur-sm hover:border-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Top gradient */}
              <div className={`h-1 w-full bg-gradient-to-r ${uc.gradient}`} />

              <div className="p-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${uc.color}10`,
                    borderColor: `${uc.color}20`,
                  }}
                >
                  <uc.icon size={28} style={{ color: uc.color }} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{uc.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">{uc.description}</p>

                {/* Stats */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  {uc.stats.map((stat, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{stat.label}</span>
                      <span className="text-lg font-bold text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 w-full h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${uc.color}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
