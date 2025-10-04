const express = require("express");
const ethers = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
console.log("Length:", process.env.PRIVATE_KEY?.length);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const USDC = new ethers.Contract(
  process.env.USDC_ADDRESS,
  [
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function balanceOf(address) view returns (uint256)",
  ],
  wallet
);

// Check facilitator balance
app.get("/balance", async (req, res) => {
  const balance = await USDC.balanceOf(wallet.address);
  res.json({
    facilitator: wallet.address,
    usdcBalance: ethers.formatUnits(balance, 6), // USDC has 6 decimals
  });
});

// Mock payment endpoint (to be replaced with x402 logic)
app.post("/pay", async (req, res) => {
  const { to, amount } = req.body;
  try {
    const tx = await USDC.transfer(to, amount);
    await tx.wait();
    res.json({ status: "success", txHash: tx.hash });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Facilitator running on http://localhost:${process.env.PORT}`);
});
