require("dotenv").config();
const express = require("express");
const { paymentMiddleware } = require("x402-express");
const cors = require("cors");

const app = express();

app.use(cors()); // allow all origins for dev

const routes = {
  "GET /ad-data": {
    price: "$0.001",
    network: "polygon-amoy",
    config: {
      description: "Fetch ad placement data",
    },
  },
};

console.log(process.env.PAYMENT_ADDRESS);
app.use(
  paymentMiddleware(process.env.PAYMENT_ADDRESS, routes, {
    url: process.env.FACILITATOR_URL,
  })
);

app.get("/ad-data", (req, res) => {
  res.json({
    adContent: "Buy 1 Get 1 Free",
    publisher: "uv",
    timestamp: new Date(),
  });
});

app.listen(4021, () => {
  console.log("Seller service running at http://localhost:4021");
});
