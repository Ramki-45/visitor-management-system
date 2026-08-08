import mongoose from "mongoose";

const { Schema } = mongoose;

const visitorSchema = new Schema(
  {
    // Display only — never used for identity matching.
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Identity key used to identify returning visitors.
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9+\-\s]{7,15}$/, "Invalid phone number format"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    idProofType: {
      type: String,
      trim: true,
      default: "",
    },

    idProofNumber: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// `phone` already creates a unique index because of `unique: true`.

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;
