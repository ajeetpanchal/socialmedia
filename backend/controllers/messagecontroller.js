const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatschema");
const Logins = require("../models/userschema");
const Messages = require("../models/messageSchema");

//@description     Get all Messages
//@route           GET /api/message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    var message = await Messages.find({ chat: req.params.chatId })
      .populate("sender", "name pic email ", Logins)
      .populate("chat", " chatName users latestMessage", Chat);
    message = await Logins.populate(message, {
      path: "chat.users",
      select: "name pic email",
      model: Logins,
    });
    res.send(message);
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  // const mess = await Messages.deleteMany({});
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.status(400);
  }
  var newmessage = {
    sender: req.message._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Messages.create(newmessage);
    message = await Messages.findOne(message._id)
      .populate("sender", "name pic email", Logins)
      .populate("chat", " chatName users latestMessage", Chat);
    message = await Logins.populate(message, {
      path: "chat.users",
      select: "name pic email",
      model: Logins,
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.send(message);
    // console.log(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
