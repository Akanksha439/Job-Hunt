import express from "express";
const app = express();

//it will look for .env file in root
import dotenv from "dotenv";
dotenv.config();

import "express-async-errors";

import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//db and authenticateUser
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome!" });
});

app.get("/api/v1", (req, res) => {
  res.json({ msg: "Welcome API!" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

//console.log(process.env.PORT);
//console.log(process.env.MONGO_URL);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
