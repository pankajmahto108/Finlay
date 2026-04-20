import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    badge: 'All-in-One Platform',
    headline: 'Replace All Your Trading\nTools with One',
    subtext: 'AI-powered system to analyze markets, generate signals, and automate strategies — all in a single, unified platform.',
    cta1: { label: 'Explore Product', href: '#features' },
    cta2: { label: 'Get Started', href: '/qbit' },
    accent: '#00ff66',
  },
  {
    badge: 'Smart Scanner',
    headline: 'Find Trade Ideas That\nMatch Your Style',
    subtext: 'Smart AI scans markets across thousands of assets and gives personalized opportunities tailored to your risk profile.',
    cta1: { label: 'Try Scanner', href: '#features' },
    cta2: { label: 'Learn More', href: '#ai-capabilities' },
    accent: '#3b82f6',
  },
  {
    badge: 'No-Code AI',
    headline: 'Generate Your Own\nPredictive AI Signals',
    subtext: 'No coding required. Build, train, and deploy AI-powered trading models with our intuitive visual interface.',
    cta1: { label: 'Start Building', href: '#ai-capabilities' },
    cta2: { label: 'See How', href: '#features' },
    accent: '#a855f7',
  },
  {
    badge: 'Meet Qbit',
    headline: 'Your Personal AI\nTrading Brain',
    subtext: 'Ask anything. Analyze charts, news, strategies, and markets instantly with our advanced LLM-powered assistant.',
    cta1: { label: 'Explore Qbit', href: '/qbit' },
    cta2: { label: 'Watch Demo', href: '#qbit-section' },
    accent: '#06b6d4',
  },
];

// Animated chart line SVG
function ChartVisual({ accent, index }) {
  const paths = [
    "M0,120 Q50,80 100,95 T200,60 T300,85 T400,40 T500,70 T600,25 T700,55 T800,30",
    "M0,100 Q80,130 150,50 T300,90 T400,30 T500,80 T600,45 T700,65 T800,20",
    "M0,80 Q60,110 120,40 T250,100 T350,55 T450,85 T550,30 T650,70 T800,35",
    "M0,90 Q70,40 140,80 T280,35 T380,95 T480,50 T580,75 T680,25 T800,60",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`grid-${index}`} width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.3" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${index})`} />
      </svg>

      {/* Chart lines */}
      <svg className="absolute bottom-0 w-full h-[60%]" viewBox="0 0 800 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`fill-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={paths[index]}
          fill="none"
          stroke={`url(#grad-${index})`}
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.path
          d={`${paths[index]} L800,150 L0,150 Z`}
          fill={`url(#fill-${index})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </svg>

      {/* Floating candlesticks */}
      <svg className="absolute bottom-[15%] left-[60%] w-[200px] h-[100px]" viewBox="0 0 200 100">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 10 + i * 28;
          const h = 15 + Math.random() * 35;
          const y = 30 + Math.random() * 30;
          const up = Math.random() > 0.4;
          return (
            <g key={i}>
              <line x1={x} y1={y - 5} x2={x} y2={y + h + 5} stroke={up ? accent : '#ef4444'} strokeWidth="1" opacity="0.6" />
              <motion.rect
                x={x - 4}
                y={y}
                width="8"
                height={h}
                fill={up ? accent : '#ef4444'}
                rx="1"
                opacity="0.5"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '80%' : '-80%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 200, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-80%' : '80%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 200, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden pt-[60px]">
      {/* Global Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: `${slide.accent}15` }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#050a15] pointer-events-none z-10" />

      {/* Chart Background */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`chart-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ChartVisual accent={slide.accent} index={current} />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: slide.accent }}
              />
              <span className="text-sm font-semibold tracking-wide" style={{ color: slide.accent }}>
                {slide.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-white leading-[1.05] whitespace-pre-line"
            >
              {slide.headline}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed"
            >
              {slide.subtext}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              {slide.cta1.href.startsWith('/') ? (
                <Link
                  to={slide.cta1.href}
                  className="group px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}aa)`,
                    boxShadow: `0 0 30px ${slide.accent}30`,
                  }}
                >
                  {slide.cta1.label}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <a
                  href={slide.cta1.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(slide.cta1.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group px-8 py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}aa)`,
                    boxShadow: `0 0 30px ${slide.accent}30`,
                  }}
                >
                  {slide.cta1.label}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}

              {slide.cta2.href.startsWith('/') ? (
                <Link
                  to={slide.cta2.href}
                  className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-sm text-center"
                >
                  {slide.cta2.label}
                </Link>
              ) : (
                <a
                  href={slide.cta2.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(slide.cta2.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all backdrop-blur-sm text-center"
                >
                  {slide.cta2.label}
                </a>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all backdrop-blur-sm"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative group"
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i === current
                  ? 'scale-100'
                  : 'bg-white/20 scale-75 hover:bg-white/40'
              }`}
              style={i === current ? { backgroundColor: s.accent, boxShadow: `0 0 10px ${s.accent}60` } : {}}
            />
            {i === current && (
              <motion.div
                layoutId="dot-ring"
                className="absolute -inset-1.5 rounded-full border-2"
                style={{ borderColor: `${s.accent}50` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-30">
        <motion.div
          key={current}
          className="h-full"
          style={{ backgroundColor: slide.accent }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
