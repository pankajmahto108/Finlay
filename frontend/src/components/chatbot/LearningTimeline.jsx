import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Lightbulb, GitCommit, ArrowRight, BrainCircuit } from 'lucide-react';

const TIMELINE_DATA = [
  {
    id: 1,
    title: "Trade 1 - Stop-Loss Triggered",
    date: "Oct 12, 2025",
    type: "failure",
    status: "Failed",
    reason: "Overestimated trend continuity during high API load volatility.",
    learned: "Added real-time VIX weighting to stop-loss calculations.",
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger/10 text-danger border-danger/20"
  },
  {
    id: 2,
    title: "Trade 2 - Break-Even Exit",
    date: "Oct 28, 2025",
    type: "neutral",
    status: "Improved",
    reason: "Dynamic stop-loss executed perfectly, but entry was delayed.",
    learned: "Optimized entry triggers using Level 2 order block anticipation.",
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
  },
  {
    id: 3,
    title: "Trade 3 - Alpha Captured",
    date: "Nov 04, 2025",
    type: "success",
    status: "Success",
    reason: "Perfect entry + Dynamic Trailing Stop maximized profits.",
    learned: "Pattern added to Hindsight core memory for similar market structures.",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10 text-success border-success/20"
  }
];

export default function LearningTimeline({ onClose }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-50">
      <div className="p-4 border-b border-white/10 bg-surface/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20 text-accent">
            <BrainCircuit size={20} />
          </div>
          <h3 className="font-bold text-white text-sm">Qbit Learning Memory</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
          <ArrowRight size={20} className="rotate-180" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          Qbit uses <span className="text-accent font-medium">Hindsight Architecture</span> to constantly evaluate past predictions. Here is the evolution of the current setup:
        </p>
        
        <motion.div 
          className="relative pl-6 border-l border-white/10 space-y-8 pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {TIMELINE_DATA.map((node, i) => (
            <motion.div key={node.id} variants={itemVariants} className="relative group">
              {/* Timeline Connector Dot */}
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-[3px] border-background ${node.bg.split(' ')[0]} flex items-center justify-center`}>
                <GitCommit size={12} className={node.color} />
              </div>
              
              <div className="glass-panel p-4 rounded-xl border border-white/5 bg-surface/40 hover:bg-surface/60 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-white">{node.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${node.bg}`}>
                    {node.status}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">{node.date}</div>
                
                <div className="space-y-3">
                  <div className="flex gap-2 items-start">
                    <node.icon size={14} className={`shrink-0 mt-0.5 ${node.color}`} />
                    <p className="text-xs text-gray-300 leading-relaxed">{node.reason}</p>
                  </div>
                  
                  <div className="flex gap-2 items-start p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <BrainCircuit size={14} className="shrink-0 mt-0.5 text-accent" />
                    <p className="text-xs text-accent/90 font-medium leading-relaxed">
                      Lcd: {node.learned}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className="p-4 border-t border-white/10 bg-surface/50 text-center">
        <span className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Lightbulb size={14} className="text-yellow-400" />
          Pattern active for current recommendation
        </span>
      </div>
    </div>
  );
}
