import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import Crypto from "../models/Crypto.js";
export const getStats = catchAsync(async (req, res, next) => {
  const coin = req.query.coin;
  console.log(coin);
  if (!coin) {
    return next(new AppError("Please provide a coin", 400));
  }
  const result = await Crypto.findOne({ id: coin }).sort({ createdAt: -1 });
  if (!result) {
    return next(new AppError("Coin not found", 404));
  }

  console.log(result);
  res.send({
    price: result.current_price,
    marketCap: result.market_cap,
    '"24hChange"': result.price_change_24h,
  });
});
