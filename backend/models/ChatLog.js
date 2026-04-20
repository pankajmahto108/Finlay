import mongoose from 'mongoose';

const chatLogSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'system', 'assistant'],
      required: true,
    },
    contextUsed: {
      type: mongoose.Schema.Types.Mixed, // Any contextual memory or agent trace used to generate the message
    }
  },
  {
    timestamps: true,
  }
);

export const ChatLog = mongoose.models.ChatLog || mongoose.model('ChatLog', chatLogSchema);
