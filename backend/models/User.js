import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    preferences: {
      riskTolerance: {
        type: String, // 'low', 'medium', 'high'
        default: 'medium',
      },
      interests: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
