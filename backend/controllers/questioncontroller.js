const asyncHandler = require("express-async-handler");
const Questions = require("../models/questionSchema");
const Answers = require("../models/answerSchema");
const Logins = require("../models/userschema");
const createque = asyncHandler(async (req, res) => {
  const { title, des } = req.body;
  if (!title || !des) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }
  try {
    var question = await Questions.create({
      user: req.message._id,
      questionName: title,
      content: des,
    });
    question = await Questions.findOne(question._id).populate(
      "user",
      "name pic email",
      Logins
    );
    console.log(question);
    res.send(question);
  } catch (error) {
    res.send(res.status(400));
    throw new Error(error.message);
  }
});
const fetchques = asyncHandler(async (req, res) => {
  try {
    var question = await Questions.find()
      .sort({
        updatedAt: -1,
      })
      .populate("user", "name pic email", Logins)
      .populate("answers", "content user upvotes", Answers);
    question = await Logins.populate(question, {
      path: "answers.user",
      select: "name pic email",
      model: Logins,
    });
    console.log(question);
    res.send(question);
  } catch (error) {
    res.send(res.status(400));
    throw new Error(error.message);
  }
});
// router.post(
//   "/createque",
//   protect,
//   asyncHandler(async (req, res) => {
//
//   })
// );
const addans = asyncHandler(async (req, res) => {
  const { answerInBody, questionId } = req.body;
  if (!answerInBody) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }

  if (!questionId) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }
  try {
    var question = await Questions.findById(questionId);
    if (!question) {
      console.log("no such question available ");
      return res.status(400);
    }
    var answer = await Answers.create({
      user: req.message._id,
      associatedQuestion: question._id,
      content: answerInBody,
    });
    answer = await Answers.findOne(answer._id)
      .populate("user", "name pic email", Logins)
      .populate("associatedQuestion", "questionName content", Questions);
    question.answers.push(answer._id);
    question.save();
    res.send(answer);
  } catch (e) {
    res.send(res.status(400));
    throw new Error(error.message);
  }
});

// router.post(
//   "/create",
//   protect,
//   asyncHandler(async (req, res) => {
//
//   })
// );
const upvotes = asyncHandler(async (req, res) => {
  const { answerId } = req.body;
  if (!answerId) {
    res.send(res.status(400));
    console.log("ans not found for like");
  }
  try {
    const answer = await Answers.findById(answerId);
    if (!answer) {
      res.send(res.status(400));
      console.log("Answer is not found");
    }
    var len = answer.upvotes.length;
    answer.upvotes.push(len + 1);
    answer.save();
    console.log(answer.upvotes.length);
    // res.send(answer.upvotes.length);
    res.send(answer);
  } catch (e) {
    res.send(400);
    res.send(res.status(400));
    throw new Error(error.message);
  }
});
// router.post(
//   "/upvotes",
//   protect,
//   asyncHandler(async (req, res) => {
//
//   })
// );
module.exports = { createque, fetchques, addans, upvotes };
