import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cron from "node-cron";
import globalErrorHandler from "./utils/errorHandler.js";
import bodyParser from "body-parser";
import axios from "axios";
import Ethereum from "./models/Crypto.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { acquireLock, releaseLock } from "./utils/redis.js";
import AppError from "./utils/appError.js";
import redis from "./utils/redis.js";
import { getStats } from "./controller/statsController.js";
import { getDeviation } from "./controller/deviationController.js";
import logger from "./utils/logger.js";
import { fetchCryptoData } from "./utils/dataFetcher.js";
const app = express();
//DB Connection
export const db = process.env.MONGO_URI;
mongoose.connect(db).then(() => {
  console.log("Connected to MongoDB");
});

//Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

//Cron Job
cron.schedule("0 */2 * * *", async () => {
  console.log("Cron job started");
  const lock = "cryptoDataFetched";
  const ttl = 1000 * 60 * 10;
  try {
    const isLocked = await acquireLock(lock, ttl);
    if (!isLocked) {
      console.log(
        "Another instance is already fetching Data. Skipping this run."
      );
      logger.info("Could not acquire lock");

      return;
    }
    fetchCryptoData();
  } catch (error) {
    console.error("Error fetching Data", error);
    logger.error("Error fetching data", error);
  } finally {
    await releaseLock(lock);
  }
});

//Routes
app.get("/", (req, res) => {
  // fetchCryptoData();
  res.send("Hello World");
});
app.get("/stats", getStats);
app.get("/deviation", getDeviation);

//Whenever the server starts, fetch the latest data
// fetchCryptoData();
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorHandler);

export default app;
