// index.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import CryptoJS from "crypto-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const MATCHID_APP_ID = process.env.MATCHID_APP_ID;
const MATCHID_SECRET_KEY = process.env.MATCHID_SECRET_KEY;
const MATCHID_BASE_URL = "https://api.matchid.ai";
const MATCHID_VERIFY_ENDPOINT = "/api/v1/partner/auth/verify";

// Middleware
app.use(cors());
app.use(express.json());

// Route: MatchID Telegram verification
app.post("/api/matchid/verify", async (req, res) => {
    try {
        const { auth_key, platform } = req.body;
        if (!auth_key || !platform) {
            return res.status(400).json({ error: "Missing auth_key or platform" });
        }

        // console.log("🔍 Platform2:", platform);

        const requestParams = {
            auth_key,
            platform: platform.charAt(0).toUpperCase() + platform.slice(1), // Capitalize first letter e.g. "Twitter"
        };

        // console.log("🔍 Platform3:", platform.charAt(0).toUpperCase() + platform.slice(1));

        const bodyString = JSON.stringify(requestParams);
        const timestamp = Date.now().toString();
        const method = "POST";
        const signatureBase =
            timestamp + method + MATCHID_VERIFY_ENDPOINT + bodyString;
        const signature = CryptoJS.HmacSHA256(signatureBase, MATCHID_SECRET_KEY);
        const sign = CryptoJS.enc.Base64.stringify(signature);

        const headers = {
            "Content-Type": "application/json",
            appid: MATCHID_APP_ID,
            timestamp,
            sign,
        };

        const MAX_RETRIES = 10;
        const DELAY_MS = 1500;

        for (let i = 0; i < MAX_RETRIES; i++) {
            const response = await axios.post(
                `${MATCHID_BASE_URL}${MATCHID_VERIFY_ENDPOINT}`,
                { requestBody: bodyString },
                { headers }
            );

            const result = response.data;

            if (result?.data?.platformId) {
                return res.status(200).json({ success: true, data: result.data });
            }

            if (result?.code === 400405) {
                console.log(`⌛ MatchID auth not ready, retrying ${i + 1}...`);
                await new Promise((r) => setTimeout(r, DELAY_MS));
                continue;
            }

            return res.status(500).json({
                success: false,
                error: result?.message || "Unknown error from MatchID",
            });
        }

        return res.status(504).json({
            success: false,
            error: "MatchID auth timed out. Try again later.",
        });
    } catch (err) {
        console.error("❌ Verification error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
