import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const cryptoSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true, default: uuidv4 },
  id: { type: String, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  current_price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  price_change_24h: { type: Number, required: true },
  last_updated: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Ensure that the 'id' field is used as the unique identifier
cryptoSchema.index({ id: 1, createdAt: -1 });

const Crypto = mongoose.model("Crypto", cryptoSchema);

export default Crypto;
