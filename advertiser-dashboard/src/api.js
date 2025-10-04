import { wrapFetchWithPayment, decodeXPaymentResponse } from "x402-fetch";
import { ethers } from "ethers";

const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

export const fetchWithPayment = wrapFetchWithPayment(fetch, window.ethereum);

export const payForAd = async () => {
  const response = await fetchWithPayment(
    `${import.meta.env.VITE_SELLER_URL}/ad-data`,
    {
      method: "GET", // match your seller service route
    }
  );

  const data = await response.json();
  const paymentResponse = decodeXPaymentResponse(
    response.headers.get("x-payment-response")
  );

  return { data, paymentResponse };
};
