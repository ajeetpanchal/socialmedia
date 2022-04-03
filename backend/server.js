const userRoute = require("./routes/userroutes");
const express = require("express");
const dotenv = require("dotenv");
const connctDB = require("./config/db");
const cors = require("cors");
const postRoute = require("./routes/posts");
const tmpuser = require("./routes/tmpuser");
const userroutes = require("./routes/userroutes");
const chatroutes = require("./routes/chatroutes");
const messageroutes = require("./routes/messageroutes");
const questionroutes = require("./routes/questionroutes");
const multer = require("multer");
const path = require("path");
// const login = require("./models/userschema");
const app = express();
dotenv.config({
  path: "./.env",
});
//connect mongodb database with backend using mongoose in separate file.
connctDB();
app.use(express.json());

app.use("/images",express.static(path.join(__dirname,"/public/images")));
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     Credential: true,
//   })
// );
//link the router file to connect with frontend easily.
//app.use(require("./routes/userroutes"));
app.use("/post",postRoute);

app.use("/api/user", userroutes);
app.use("/api/chat", chatroutes);
app.use("/api/message", messageroutes);
app.use("/api/question", questionroutes);


const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"backend/public/images");
  },
  filename:(req,file,cb)=>{
    const fileNameis = Date.now()+file.originalname;
    cb(null,file.originalname);
  },
});
const upload = multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
  try{
    console.log("post up")
    return res.status(200).json("uploaded succe")
  }catch(err){
    console.log(err)
  }
})


//app.use("/",userRoute);
app.use("/tmp",tmpuser);

const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`server starting...${port}`));
const io = require("socket.io")(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("conected... to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room : " + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
    console.log("typing in room : ", room);
  });
  socket.on("stoptyping", (room) => {
    socket.in(room).emit("stoptyping");
  });

  socket.on("new message", (newmessageReceived) => {
    console.log(newmessageReceived);
    var chat = newmessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newmessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newmessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });
});