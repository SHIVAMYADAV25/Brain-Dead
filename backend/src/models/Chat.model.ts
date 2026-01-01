// src/models/Chat.js
import mongoose, { Schema  } from "mongoose";

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

    // Defines WHAT the chat is scoped to
    scope: {
      type: String,
      enum: ["global", "content", "page", "project"],
      required: true,
      index: true,
    },

    // Used for single page / content / project chat
    scopeId: {
      type: Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // Used ONLY for multi-select (page or content)
    scopeIds: {
      type: [Schema.Types.ObjectId],
      default : []
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

chatSchema.pre("validate", function () {
  // GLOBAL chat
  if (this.scope === "global") {
    if (this.scopeId || this.scopeIds.length > 0) {
      throw new Error("Global chat cannot have scopeId or scopeIds");
    }
  }

  // PROJECT chat (single only)
  if (this.scope === "project") {
    if (!this.scopeId || this.scopeIds.length > 0) {
      throw new Error("Project chat must have exactly one scopeId");
    }
  }

  // PAGE or CONTENT
  if (this.scope === "page" || this.scope === "content") {
    if (this.scopeId && this.scopeIds.length > 0) {
      throw new Error("Use either scopeId or scopeIds, not both");
    }

    if (!this.scopeId && this.scopeIds.length === 0) {
      throw new Error("Page/Content chat must have scopeId or scopeIds");
    }
  }
});



export const Chat = mongoose.model("Chat", chatSchema);
