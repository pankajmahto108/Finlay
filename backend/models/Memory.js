import mongoose from 'mongoose';

const memorySchema = mongoose.Schema(
  {
    userId: {
      type: String, // String instead of ObjectId since userId might come from auth provider or frontend directly
      required: true,
      index: true
    },
    memoryType: {
      type: String, // 'trade_outcome', 'user_preference', 'strategy_insight'
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // For storing flexible metadata (e.g., success rate, profit target hit)
    },
    vectorId: {
      type: String, // If tied to Hindsight/Pinecone vector DB
    }
  },
  {
    timestamps: true,
  }
);

export const Memory = mongoose.models.Memory || mongoose.model('Memory', memorySchema);
