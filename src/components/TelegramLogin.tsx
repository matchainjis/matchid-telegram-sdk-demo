// components/TelegramLogin.tsx
import { Hooks } from "@matchain/matchid-sdk-react";
import { useState } from "react";

export default function TelegramLogin() {
  const { useUserInfo, useWallet } = Hooks;
  const { isLogin, login, getAuthInfo } = useUserInfo();
  const { address } = useWallet();
  const [authInfo, setAuthInfo] = useState(null);

  const handleLogin = async () => {
    try {
      await login("telegram");
      const info: any = await getAuthInfo("telegram");
      setAuthInfo(info);

      console.log("✅ Telegram Auth Info:", info);
      console.log("✅ Auth Info:", authInfo);
    } catch (error) {
      console.error("❌ Telegram Login Failed:", error);
    }
  };

  if (isLogin) {
    return (
      <div>
        <p>
          ✅ Logged in as: <strong>{address}</strong>
        </p>
      </div>
    );
  }

  return <button onClick={handleLogin}>Login with MatchID (Telegram)</button>;
}
