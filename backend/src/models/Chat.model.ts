// src/models/Chat.js
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scope: {
      type: String,
      enum: ["global", "content", "page", "project"],
      required: true,
      index: true,
    },

    scopeId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Chat = mongoose.model("Chat", chatSchema);
