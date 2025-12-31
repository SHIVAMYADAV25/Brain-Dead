import mongoose, { Schema } from "mongoose";

const chunkSchema = new Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    parentType:{
        type: String,
        enum : ["content","page"],
        required : true,
        index: true,
    },
    parentId : {
        type : Schema.Types.ObjectId,
        required : true,
        index: true,
    },
    text: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    index: {
      type: Number,
      required: true,
    },
},{timestamps : {createdAt : true, updatedAt : true}})

/**
 * Composite indexes for fast RAG queries
 */
chunkSchema.index({ userId: 1, parentType: 1, parentId: 1 });
chunkSchema.index({ userId: 1 });

export const Chunk = mongoose.model("chunk",chunkSchema)
