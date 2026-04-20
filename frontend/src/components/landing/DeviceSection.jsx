import { motion } from 'framer-motion';
import { Monitor, Smartphone, Globe } from 'lucide-react';

const devices = [
  {
    icon: Globe,
    title: 'Chrome Extension',
    description: 'Get AI insights on any financial page. Overlay charts, scanners, and Qbit analysis directly in your browser.',
    color: '#f59e0b',
    badge: 'Popular',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Trade and analyze on the go with our native iOS and Android apps. Full Qbit access in your pocket.',
    color: '#00ff66',
    badge: 'Coming Soon',
  },
  {
    icon: Monitor,
    title: 'Desktop Access',
    description: 'Full-featured web platform optimized for large screens. Multi-chart layouts, advanced scanners, and more.',
    color: '#3b82f6',
    badge: 'Available',
  },
];

export default function DeviceSection() {
  return (
    <section id="devices" className="relative py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
            <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
            <span className="text-sm font-semibold text-[#06b6d4] tracking-wide">Multi-Platform</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
            Trade From{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#3b82f6]">
              Anywhere
            </span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Access your AI trading toolkit from any device, seamlessly synced across all platforms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {devices.map((device, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative rounded-2xl p-10 border border-white/5 bg-[#0f172a]/40 backdrop-blur-sm hover:border-white/10 transition-all duration-500 text-center overflow-hidden"
            >
              <div
                className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: device.color }}
              />

              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border"
                  style={{
                    color: device.color,
                    borderColor: `${device.color}30`,
                    backgroundColor: `${device.color}10`,
                  }}
                >
                  {device.badge}
                </span>
              </div>

              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center border mx-auto mb-8 transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundColor: `${device.color}10`,
                  borderColor: `${device.color}20`,
                }}
              >
                <device.icon size={40} style={{ color: device.color }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">{device.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{device.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
