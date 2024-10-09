import Crypto from "../models/Crypto.js";
import axios from "axios";
const COIN_IDS = ["bitcoin", "matic-network", "ethereum"];
const API_URL = "https://api.coingecko.com/api/v3/coins/markets";

export async function fetchCryptoData() {
  try {
    for (const coinId of COIN_IDS) {
      const response = await axios.get(API_URL, {
        params: {
          vs_currency: "usd",
          ids: coinId,
        },
      });
      if (response.data && response.data.length > 0) {
        const coin = response.data[0];
        const newCryptoData = new Crypto({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          price_change_24h: coin.price_change_24h,
          last_updated: coin.last_updated,
        });

        await newCryptoData.save();
        console.log(`Saved new data for ${coin.name}`);
      }
    }

    console.log("All crypto data updated successfully");
  } catch (error) {
    console.error("Error fetching crypto data:", error);
  }
}
