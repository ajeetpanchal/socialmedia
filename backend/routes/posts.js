const router = require("express").Router();
const Post = require("../models/post");

const User = require("../models/userschema");

//create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
});
//delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("the post has been deleted")
        } else {
            res.status(403).json("you can delet only ypur post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//like post

router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been like");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("the post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});
//get a post

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});
//timeline

router.get("/timeline/:userId", async (req, res) => {
    let postArray = [];
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id })
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err);
    }
});


//get users all posts

router.get("/profile/:College_id", async (req, res) => {
    try {
        const user = await User.findOne({ College_id: req.params.College_id });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
