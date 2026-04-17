import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = true, padding = 'p-6', ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`glass-panel rounded-2xl relative overflow-hidden group ${padding} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
