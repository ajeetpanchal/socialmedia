const mongoose = require("mongoose");
const connctDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongo DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

module.exports = connctDB;
