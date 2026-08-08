import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
      default: "",
    },

    // Nullable — set only if this employee also has login access.
    // Employee → User relationship.
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Soft delete.
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

employeeSchema.index({ department: 1 });
employeeSchema.index({ userId: 1 });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
