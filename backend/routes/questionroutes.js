const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authmiddleware");
const {
  createque,
  fetchques,
  addans,
  upvotes,
} = require("../controllers/questioncontroller");
router.route("/create").post(protect, createque);
router.route("/fetch").get(protect, fetchques);
router.route("/add").post(protect, addans);
router.route("/upvote").post(protect, upvotes);
module.exports = router;
