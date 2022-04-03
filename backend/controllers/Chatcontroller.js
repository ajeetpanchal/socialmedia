const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatschema");
const Logins = require("../models/userschema");
const Messages = require("../models/messageSchema");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  //create one on one chat
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.message._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password", Logins)
    .populate("latestMessage", Messages);
  isChat = await Logins.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
    model: Messages,
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      users: [req.message._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password",
        Logins
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.message._id } },
    })
      .populate("users", "-password", Logins)
      .populate("latestMessage", " sender content", Messages)
      .sort({
        updateAt: -1,
      })
      .then(async (results) => {
        results = await Logins.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
          model: Logins,
        });
        res.status(200).send(results);
      });
  } catch (e) {
    res.status(400);
    console.error(e);
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected

module.exports = {
  accessChat,
  fetchChats,
};
