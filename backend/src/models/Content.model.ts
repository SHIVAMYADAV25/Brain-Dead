// src/models/Content.js
import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    sourceUrl: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["youtube", "website", "pdf"],
      required: true,
    },

    extractedText: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Content = mongoose.model("Content", contentSchema);
