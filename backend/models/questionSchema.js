const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Logins",
    },
    questionName: {
      type: String,
    },
    content: {
      type: String,
    },
    answers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answers",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Questions = mongoose.model("QUESTIONS", QuestionSchema);
module.exports = Questions;
