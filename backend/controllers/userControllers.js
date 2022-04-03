const asyncHandler = require("express-async-handler");
const Logins = require("../models/userschema");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
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

//@description     Auth the user
//@route           POST /api/user/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  console.log("aa");
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
        followers: userLogin.followers,
        followings: userLogin.followings,
        token: token,

      });
      //res.send(userLogin);
      res.json({ message: "login sucessfully" });
    }
  } catch (e) {
    res.send(e);
  }
});

const forgotpassword = asyncHandler(async (req, res) => {
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
module.exports = { allUsers, forgotpassword, authUser };
