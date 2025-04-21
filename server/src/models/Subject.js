const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Subject description is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Subject icon is required"],
      default: "💻",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subject", subjectSchema);
