import mongoose from "mongoose";
import {
  ALL_VISIT_STATUSES,
  VISIT_STATUS,
  ACTIVE_STATUSES,
} from "../constants/visitStatus.js";

const { Schema } = mongoose;

const visitRequestSchema = new Schema(
  {
    visitorId: {
      type: Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },

    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    purpose: {
      type: String,
      required: [true, "Purpose of visit is required"],
      trim: true,
    },

    // Visit schedule
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },

    expectedArrivalTime: {
      type: String,
      required: [true, "Expected arrival time is required"],
      match: [
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "Expected arrival time must be in HH:mm format",
      ],
    },

    status: {
      type: String,
      enum: {
        values: ALL_VISIT_STATUSES,
        message: "{VALUE} is not a valid status",
      },
      default: VISIT_STATUS.PENDING,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    checkedInBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    checkedOutBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// --------------------
// Indexes
// --------------------

visitRequestSchema.index({ visitorId: 1 });

visitRequestSchema.index({ employeeId: 1 });

visitRequestSchema.index({ employeeId: 1, status: 1 });

visitRequestSchema.index({ status: 1 });

visitRequestSchema.index({ visitDate: 1 });

visitRequestSchema.index(
  { visitorId: 1, visitDate: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: ACTIVE_STATUSES,
      },
    },
  },
);

const VisitRequest = mongoose.model("VisitRequest", visitRequestSchema);

export default VisitRequest;
