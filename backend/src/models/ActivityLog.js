import mongoose from "mongoose";
import { ALL_ACTIVITY_ACTIONS } from "../constants/activityActions.js";

const { Schema } = mongoose;

const activityLogSchema = new Schema(
  {
    visitRequestId: {
      type: Schema.Types.ObjectId,
      ref: "VisitRequest",
      required: true,
    },

    action: {
      type: String,
      enum: {
        values: ALL_ACTIVITY_ACTIONS,
        message: "{VALUE} is not a valid activity action",
      },
      required: true,
    },

    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Carries remarks/reason for actions such as rejection or cancellation.
    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Append-only collection; no updatedAt field.
    timestamps: false,
  },
);

// Fetch activity history for a visit request.
activityLogSchema.index({ visitRequestId: 1 });

// Chronological sorting / reporting.
activityLogSchema.index({ timestamp: 1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
