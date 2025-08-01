// src/pages/LoginScreen.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";
// import { Hooks } from "@matchain/matchid-sdk-react";
import axios from "axios";
import "./LoginScreen.css"; // Optional for styling

// const { useUserInfo } = Hooks;
const APP_ID = import.meta.env.VITE_MATCHID_APP_ID;

export async function getLoginCode(appId: string) {
  try {
    const response = await fetch(
      "https://api.matchid.ai/api/v1/tgapp/login/init",
      { method: "GET", headers: { appid: appId } },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch login code");
    }

    const result = await response.json();

    // Ensure both code and login_url exist in the response
    if (!result.data?.code || !result.data?.login_url) {
      throw new Error("Invalid response format from login/init");
    }

    return { code: result.data.code, tglink: result.data.login_url };
  } catch (err: any) {
    throw err.message;
  }
}

export async function launchMatchIDAuthTgMiniApp({
  tg_link,
  appid,
  code,
  locale = "en",
}: {
  tg_link: string;
  appid: string;
  code: string;
  locale?: string;
}) {
  const startAppParam = `${code}_${appid}_${locale}`;
  const fullURL = `${tg_link}?startapp=${startAppParam}`;

  (window.Telegram?.WebApp as any)?.openTelegramLink(fullURL);
}

export async function tgAppLoginApi({
  appid,
  code,
  tg_login_params,
}: {
  appid: string;
  code: string;
  tg_login_params: any;
}) {
  try {
    const response = await fetch(
      "https://api.matchid.ai/api/v1/tgapp/login/status",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", appid: appid },
        body: JSON.stringify({ code, tg_login_params }),
      },
    );

    const result = await response.json();

    if (result.code === 0) {
      return result;
    } else {
      return result;
    }
  } catch (err: any) {
    return err.message;
  }
}

export async function fetchUserAuth(access_token: string) {
  const res = await axios.get(`https://api.matchid.ai/api/v1/user/auth`, {
    headers: { Authorization: `Bearer ${access_token}`, Appid: APP_ID },
  });

  return res.data.data; // contains address, did, etc.
}

export async function getUserInfoOverview(access_token: string) {
  const res = await axios.get(`https://api.matchid.ai/api/v1/user/overview`, {
    headers: { Authorization: `Bearer ${access_token}`, Appid: APP_ID },
  });

  return res.data.data; // contains user mid infos
}

export function showToast(message: string) {
  (window.Telegram?.WebApp as any)?.showPopup({ message });
}

export default function LoginScreen() {
  const [loadingMessage, setLoadingMessage] = useState("");
  const platformRef = useRef("telegram");
  // const { login, getAuthInfo } = useUserInfo();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  const dispatch = useDispatch();

  // const platformMap: any = {
  //   x: "twitter",
  //   telegram: "telegram",
  //   google: "google",
  //   // and so on for other login methods
  // };

  const handleLogin = async (platform: any) => {
    try {
      platformRef.current = platform; // save selected platform
      // 1. Get code and tglink
      const { code, tglink } = await getLoginCode(APP_ID);
      setLoadingMessage("Launching MatchID Auth Mini App...");
      // Because openTelegramLink may cause instant navigation out
      await new Promise((r) => setTimeout(r, 100)); // allow render cycle
      // 2. Authenticate with MatchID Auth Telegram Mini App
      await launchMatchIDAuthTgMiniApp({
        tg_link: tglink,
        appid: APP_ID,
        code,
        locale: "en",
      });
      setLoadingMessage(""); // clear after triggering
      // 3. Start polling for auth status after user returns from MatchID Auth Telegram Mini App
      let attempts = 0;
      const maxAttempts = 15; // ~30 seconds
      const delayMs = 2000;

      const intervalId = setInterval(async () => {
        attempts++;

        const result = await tgAppLoginApi({
          appid: APP_ID,
          code,
          tg_login_params: (window.Telegram?.WebApp as any).initData,
        });

        if (result?.code === 0) {
          clearInterval(intervalId);

          // You can now store token, etc.
          const accessToken = result.data.access_token;

          // Fetch core user auth data
          const userAuth = await fetchUserAuth(accessToken);

          // Fetch user overview data
          const userOverview = await getUserInfoOverview(accessToken);

          // save data to your store
          await handleLoginSuccess(accessToken, userAuth, userOverview);

          setLoadingMessage("Logging in... Redirecting you now...");
          await new Promise((r) => setTimeout(r, 100)); // let DOM show message

          // notify login success
          showToast("✅ Login successful!");
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          // notify login timeout
          showToast("❌ Login timeout. Please try again.");
        }
      }, delayMs);
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  const handleLoginSuccess = async (
    accessToken: string,
    userAuth: any,
    userOverview: any,
  ) => {
    try {
      dispatch(
        setUser({
          nickname: userOverview.username || "",
          matchidAddress: userAuth.address || "",
          matchidDid: userAuth.did || "",
          matchidToken: accessToken,
          isAuthenticated: true,

          // Additional persisted fields
          username: userOverview.username,
          userLevel: userOverview.user_level,
          identities: userOverview.identities,
          isKYC: userOverview.is_kyc,
          isPoH: userOverview.is_poh,
          score: userOverview.score,
        }),
      );
    } catch (err) {
      console.error("❌ Something happened while managing your data:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLoadingMessage(""); // ✅ hide loader
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      {loadingMessage && (
        <div className={`loading-overlay ${!loadingMessage ? "hidden" : ""}`}>
          <div className="loading-spinner" />
          <p>{loadingMessage}</p>
        </div>
      )}
      <div className="login-screen">
        <h1>Welcome to DeGen Space</h1>
        <button onClick={() => handleLogin("telegram")}>
          Login with MatchID
        </button>
        {/* <button onClick={() => handleLogin("x")}>Login with Twitter</button>
      <button onClick={() => handleLogin("google")}>Login with Google</button> */}
        {/* and so on for other login methods */}
      </div>
    </>
  );
}
