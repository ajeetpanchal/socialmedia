//this middleware is very important for authorization of user who currently logged in our website.
//we verify and autonticate that user by this middleware using JWT tokens send at the time of login

const jwt = require("jsonwebtoken");
const Logins = require("../models/userschema");
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);

      // decodes token id
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.message = await Logins.findById(decode.id).select("-password");

      console.log("protect work complete");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ Error: "Not authorized, no token" });
  }
};
module.exports = protect;
