import "dotenv/config";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception at:", err.name, err.message);
  console.error(err.stack);
  console.log("Shutting down server due to Uncaught Exception");
  process.exit(1);
});

import app from "./app.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection at:", err.name, err.message);
  console.error(err.stack);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1); //this will just immediately od it so first stop the server
  });
});
