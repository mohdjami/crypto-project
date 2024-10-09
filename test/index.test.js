import request from "supertest";
import app from "../app.js";

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("GET /stats", () => {
  test("It should respond with an array of stats", async () => {
    const response = await request(app).get("/stats?coin=bitcoin");
    expect(response.body).toHaveProperty("price");
    expect(response.body).toHaveProperty("marketCap");
    expect(response.body).toHaveProperty('"24hChange"');
    expect(response.statusCode).toBe(200);
  });
});

describe("GET /deviation", () => {
  test("It should respond with an object containing the deviation", async () => {
    const response = await request(app).get("/deviation?coin=bitcoin");
    expect(response.body).toHaveProperty("deviation");
    expect(response.statusCode).toBe(200);
  });
});
