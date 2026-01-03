import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatContextSchema = new Schema({
    token : {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    scope : {
        type:String,
        enum : ["page" , "content"],
        required: true,
        index: true,
    },
    scopeIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: [],
    },
    expiresAt : {
        type : Date,
        required: true,
        index: true,
    }
},{
    timestamps: false, // context is not historical data
})


//  What this means in practice

// If you saved:
    // expiresAt = 12:30 PM
// MongoDB will:
// At ~12:31 PM → auto delete the document


// Why expireAfterSeconds: 0?
// Because:
// expiresAt already contains the exact expiry time
// MongoDB deletes when time is passed

chatContextSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const ChatContext = mongoose.model("chatContext",chatContextSchema);