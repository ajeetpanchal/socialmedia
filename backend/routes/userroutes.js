
const express = require("express");
const {
  forgotpassword,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.post("/forgot", forgotpassword);
router.route("/login").post(authUser);

module.exports = router;
