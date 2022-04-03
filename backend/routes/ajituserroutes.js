//for all routes of our website
const asyncHandler = require("express-async-handler");
const express = require("express");
const router = express.Router();
const connctDB = require("../config/db");
const Chat = require("../models/chatschema");
const Logins = require("../models/userschema");
const Messages = require("../models/messageSchema");
const generateToken = require("../config/generatetoken");


connctDB();
//login routes to login into the website
router.post("/login", async (req, res) => {
  // res.json({ message: req.body });
  try {
    // res.send(req.body.password);
    const { College_name, College_id, password } = req.body;
    // res.send(password);
    if (!College_name || !College_id || !password) {
      return res.status("400").json({ error: "please enter data " });
    }
    // res.send({ message: "awesom " });
    const userLogin = await Logins.findOne({
      College_name: College_name,
      College_id: College_id,
      password: password,
    });
    console.log(userLogin);
    if (!userLogin) {
      res.status("400").json({ error: "please enter valid data" });
    } else {
      res.status(200);
      const token = generateToken(userLogin._id);
      res.send({
        _id: userLogin._id,
        College_id: userLogin.College_id,
        College_name: userLogin.College_name,
        name: userLogin.name,
        email: userLogin.email,
        pic: userLogin.pic,
        token: token,
      });
      res.json({ message: "login sucessfully" });
    }
  } catch (e) {
    console.error("some error accure ");
  }
});

//reset password routes if user forgot the password

router.post("/forgot", async (req, res) => {
  try {
    const { College_id, new_password, confirm_password } = req.body;
    // console.log(College_id);
    if (!College_id) {
      return res.status("400").json({ error: "please enter valid email id " });
    }
    const userLogin = await Logins.findOne({
      College_id: College_id,
    });
    console.log(userLogin);
    if (!userLogin) {
      res.status("400").json({ error: "please enter valid data" });
    } else {
      if (new_password === confirm_password) {
        const update = await Logins.updateOne(
          { College_id: College_id },
          {
            $set: {
              password: confirm_password,
            },
          }
        );
        res.status("200").json({ message: "awsome your password change" });
      } else {
        res.status("400").json({ error: "please enter valid data" });
      }
    }
  } catch (e) {
    console.log("some issue is there ");
  }
});

//to search the users of our website
//it also uses the protect middleware so search result will not return currently loggin user.
router.get("/message", async (req, res) => {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const users = await Logins.find(keyword).find({
    _id: { $ne: req.message._id },
  });
  res.send(users);
  console.log(users);
});

//create one to one chat and check the user who is craeting the chat is valid authorize user or not
//alse check other user whith whome the chat will create that user is also valid authorize or not
router.post("/chat", async (req, res) => {
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
//fetch all the chats
router.get("/chat", async (req, res) => {
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

router.post(
  "/sendmessage",
  asyncHandler(async (req, res) => {
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
  })
);

router.get(
  "/:chatId",
  asyncHandler(async (req, res) => {
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
  })
);


module.exports = router;
