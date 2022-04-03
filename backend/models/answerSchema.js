const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Logins",
    },
    content: {
      type: String,
    },
    associatedQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questions",
    },
    upvotes: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Answers = mongoose.model("ANSWERS", answerSchema);

module.exports = Answers;
