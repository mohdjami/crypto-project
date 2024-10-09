import redis from "../utils/redis.js";
import catchAsync from "../utils/catchAsync.js";
import Crypto from "../models/Crypto.js";
export const getDeviation = catchAsync(async (req, res) => {
  try {
    const { coin } = req.query;

    if (!coin) {
      return res.status(400).json({ error: "Coin parameter is required" });
    }

    // Fetch the last 100 records for the specified coin
    const records = await Crypto.find({ id: coin })
      .sort({ createdAt: -1 })
      .limit(100)
      .select("current_price");

    if (records.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the specified coin" });
    }

    // Extract prices from records
    let prices = records.map((record) => record.current_price);
    // Calculate mean
    const mean = prices.reduce((acc, price) => acc + price, 0) / prices.length;

    // Calculate sum of squared differences
    const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce(
      (sum, diff) => sum + diff,
      0
    );

    // Calculate standard deviation
    const standardDeviation = Math.sqrt(sumSquaredDiff / prices.length);

    res.json({ deviation: parseFloat(standardDeviation.toFixed(2)) });
  } catch (error) {
    console.error("Error calculating deviation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
