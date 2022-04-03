const express = require("express");
const router = express.Router();
const Logins = require("../models/userschema");

// get user
// lh:500/user?college_id = 19
router.get("/", async (req, res) => {

  const userId = req.query.id;
  const College_id = req.query.College_id;
  console.log(userId);
  console.log();
  try {
    const user = userId
      ? await Logins.findById(userId)
      : await Logins.findOne({ College_id: College_id });
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
})

// follow user

router.put("/:id/follow", async (req, res) => {
  if (req.body.College_id !== req.params.id) {
    try {
      const user = await Logins.findById(req.params.id);
      const currentUser = await Logins.findById(req.body.College_id);
      if (!user.followers.includes(req.body.College_id)) {
        await user.updateOne({ $push: { followers: req.body.College_id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});


//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.College_id !== req.params.id) {
    try {
      const user = await Logins.findById(req.params.id);
      const currentUser = await Logins.findById(req.body.College_id);
      if (user.followers.includes(req.body.College_id)) {
        await user.updateOne({ $pull: { followers: req.body.College_id } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});
//get a friendList


router.get("/friends/:userId", async(req,res) => {
  try{
    const user = await Logins.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map( (friendId) => {
        return Logins.findById(friendId);
      })
    );
    //console.log(friends);
    // let friendList = [];
    // friends.map((friend) => {
    //   const {_id,name,pic} = friend;
    //   friendList.push({_id,name,pic});
    // });
    // console.log(friendList)
    res.status(200).json(friends)
  }catch(err){
    console.log("start")
    console.log(err);
    res.status(500).json(err);
  }
});
module.exports = router; 