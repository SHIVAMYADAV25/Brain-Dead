// src/models/Project.js
import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    contentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Content",
      },
    ],

    pageIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Project = mongoose.model("Project", projectSchema);
