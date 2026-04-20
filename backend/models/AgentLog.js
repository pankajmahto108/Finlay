import mongoose from 'mongoose';

const agentLogSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    agentName: {
      type: String, // 'Qbit', 'TradingAgent', 'AnalysisAgent'
      required: true,
    },
    input: {
      type: mongoose.Schema.Types.Mixed,
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
    },
    durationMs: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['success', 'error'],
      default: 'success'
    }
  },
  {
    timestamps: true,
  }
);

export const AgentLog = mongoose.models.AgentLog || mongoose.model('AgentLog', agentLogSchema);
