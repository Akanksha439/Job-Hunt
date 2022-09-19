import mongoose from "mongoose";

/*mongoose connect function returns a promise,
therefore we will setup async await in server.js*/

const connectDB = (url) => {
  return mongoose.connect(url);
};
export default connectDB;
