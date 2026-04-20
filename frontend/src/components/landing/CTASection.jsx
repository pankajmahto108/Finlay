import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] to-[#050a15]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff66]/10 blur-[150px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3b82f6]/10 blur-[120px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
          <div className="absolute inset-0 border border-white/5 rounded-3xl" />

          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#00ff66]/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 lg:px-20 lg:py-24 text-center">
            <Sparkles size={40} className="text-[#00ff66] mx-auto mb-6" />

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
              Ready to Trade{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#3b82f6]">
                Smarter with AI?
              </span>
            </h2>

            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of traders who've upgraded their edge. Start with Finlay today and experience the future of intelligent trading.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/qbit"
                className="group px-10 py-5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#3b82f6] text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_50px_rgba(0,255,102,0.3)] transition-all hover:scale-105"
              >
                Get Started Now
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-sm"
              >
                See Features
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#00ff66]" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#00ff66]" />
                Cancel anytime
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
