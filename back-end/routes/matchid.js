// server/routes/matchid.js
import express from "express";
import axios from "axios";
import CryptoJS from "crypto-js";

const router = express.Router();

const APP_ID = process.env.MATCHID_APP_ID;
const SECRET_KEY = process.env.MATCHID_SECRET_KEY;
const BASE_URL = "https://api.matchid.ai";
const ENDPOINT = "/api/v1/partner/auth/verify";

router.post("/verify", async (req, res) => {
    const { auth_key } = req.body;
    const requestParams = { auth_key, platform: "telegram" };
    const bodyString = JSON.stringify(requestParams);
    const timestamp = Date.now().toString();
    const method = "POST";
    const signatureBase = timestamp + method + ENDPOINT + bodyString;
    const signature = CryptoJS.HmacSHA256(signatureBase, SECRET_KEY);
    const sign = CryptoJS.enc.Base64.stringify(signature);

    const headers = {
        "Content-Type": "application/json",
        appid: APP_ID,
        timestamp,
        sign,
    };

    // ✅ Long-poll until authorized or timeout
    for (let i = 0; i < 10; i++) {
        const matchidRes = await axios.post(
            `${BASE_URL}${ENDPOINT}`,
            { requestBody: bodyString },
            { headers }
        );

        const data = matchidRes?.data?.data;

        if (data?.platformId) {
            return res.status(200).json({ success: true, data });
        }

        if (matchidRes?.data?.code === 400405) {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // wait and retry
        } else {
            return res.status(500).json({
                success: false,
                error: matchidRes?.data?.message || "Unexpected MatchID error",
            });
        }
    }

    return res.status(504).json({
        success: false,
        error: "Timeout waiting for Telegram authorization",
    });
});

export default router;
