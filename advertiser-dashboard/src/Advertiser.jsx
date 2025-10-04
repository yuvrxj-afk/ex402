import React, { useState } from "react";
import { decodeXPaymentResponse, wrapFetchWithPayment } from "x402-fetch";

export default function Advertiser() {
    const [adContent, setAdContent] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
        }

        const fetchWithPayment = wrapFetchWithPayment(fetch, window.ethereum, {
            network: "polygon-amoy"
        });

        try {
            const response = await fetchWithPayment(`${import.meta.env.VITE_SELLER_URL}/ad-data`, {
                method: "GET",
            });

            const data = await response.json();
            const paymentResponse = decodeXPaymentResponse(
                response.headers.get("x-payment-response")
            );
            setStatus("✅ Ad submitted successfully! " + JSON.stringify(data));
        } catch (err) {
            setStatus("❌ Payment failed: " + err.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Advertiser Dashboard</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    rows={4}
                    cols={50}
                    placeholder="Enter your ad content"
                    value={adContent}
                    onChange={(e) => setAdContent(e.target.value)}
                />
                <br />
                <button type="submit">Pay & Submit Ad</button>
            </form>
            <p>{status}</p>
        </div>
    );
}
