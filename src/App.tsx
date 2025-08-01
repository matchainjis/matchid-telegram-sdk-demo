// import { useAccount, useConnect, useDisconnect } from 'wagmi';

// function App() {
//   const account = useAccount();
//   const { connectors, connect, status, error } = useConnect();
//   const { disconnect } = useDisconnect();

//   return (
//     <div className="container">
//       <h2>Wallet Connection</h2>

//       {/* Account Status */}
//       <div className="account-status">
//         <strong>Status:</strong> {account.status}
//         <br />
//         <strong>Addresses:</strong> {JSON.stringify(account.addresses)}
//         <br />
//         <strong>Chain ID:</strong> {account.chainId}
//       </div>

//       {/* Disconnect Button */}
//       {account.status === 'connected' && (
//         <button onClick={() => disconnect()}>Disconnect</button>
//       )}

//       {/* Connect Buttons */}
//       <h2>Connect</h2>
//       {connectors.map((connector) => (
//         <button key={connector.uid} onClick={() => connect({ connector })}>
//           {connector.name}
//         </button>
//       ))}

//       {/* Connection Status */}
//       <div>{status}</div>
//       <div style={{ color: 'red' }}>{error?.message}</div>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { WalletProvider } from "./context/WalletContext";
import Navbar from "./components/Navbar";
import ActivityPopup from "./components/ActivityPopup";
import Home from "./pages/Home";
import Trading from "./pages/Trading";
import Assets from "./pages/Assets";
import Signals from "./pages/Signals";
import Dashboard from "./pages/Dashboard";
import LoginScreen from "./pages/LoginScreen";
import { injectOpenAd } from "./utils/openAdUtils";
import createAdHandler from "monetag-tg-sdk";
import { useSelector } from "react-redux";

const adHandler = createAdHandler(9079498); // e.g., 9079498

// export function onRouteChange() {
//   const scriptId = "monetag-sdk";

//   if (!document.getElementById(scriptId)) {
//     console.log("Injecting Monetag script..."); // Debugging log

//     const script = document.createElement("script");
//     script.src = "//ushoaglosee.com/sdk.js";
//     script.setAttribute("data-zone", "9079498");
//     script.setAttribute("data-sdk", "show_9079498");
//     script.async = true;
//     script.id = scriptId;

//     script.onload = () => console.log("✅ Monetag script loaded successfully!");
//     script.onerror = () => console.error("❌ Failed to load Monetag script!");

//     document.head.appendChild(script);
//   } else {
//     console.log("Monetag script already injected.");
//   }
// }

// Function to check if an ad can be shown (max 4 times per day)
function canShowAd() {
  const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
  const adCountKey = `adCount_${today}`;
  let adCount = parseInt(localStorage.getItem(adCountKey) || "0", 10);

  if (adCount < 4) {
    localStorage.setItem(adCountKey, (adCount + 1).toString());
    return true;
  }
  console.warn("Ad limit reached for today.");
  return false;
}

// // Function to show Rewarded Interstitial Ad
// function showRewardedInterstitial(callback: () => void) {
//   if (!canShowAd()) return;

//   if (typeof window.show_9079498 === "function") {
//     window
//       .show_9079498()
//       .then(() => {
//         console.log("✅ User watched the ad! Reward the user here.");
//         // 给用户增加一个积分
//         callback(); // Navigate after ad
//       })
//       .catch((err) => console.error("❌ Ad failed to load:", err));
//   } else {
//     console.warn("⚠️ Monetag script not available yet.");
//   }
// }

function showRewardedInterstitial(onReward: () => void) {
  adHandler()
    .then(() => {
      console.log("✅ User completed the ad interaction!");
      onReward(); // safely give reward here
    })
    .catch((err) => {
      console.error("❌ Ad was skipped or failed:", err);
    });
}

// Function to show Rewarded Popup Ad
function showRewardedPopup(callback: () => void) {
  if (!canShowAd()) return;

  if (typeof window.show_9079498 === "function") {
    window
      .show_9079498("pop")
      .then(() => {
        console.log("✅ Rewarded Popup Ad watched.");
        // 给用户增加两个积分
        callback(); // Navigate after ad
      })
      .catch((err) => console.error("❌ Error playing popup ad:", err));
  } else {
    console.warn("⚠️ Monetag script not available yet.");
  }
}

// Function to show In-App Interstitial Ad
function showInAppAd() {
  if (!canShowAd()) return;

  if (typeof window.show_9079498 === "function") {
    window.show_9079498({
      type: "inApp",
      inAppSettings: {
        frequency: 2,
        capping: 0.1, // Max ads within 6 min
        interval: 30, // 30s between ads
        timeout: 5,
        everyPage: false,
      },
    });
    console.log("✅ In-App Interstitial Ad triggered.");
  } else {
    console.warn("⚠️ Monetag script not available yet.");
  }
}

export default function App({ stateLocal }: { stateLocal: any }) {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  const [showPopup, setShowPopup] = useState(true);
  // const dispatch = useDispatch();
  // const [appid, setAppid] = useState(
  //   stateLocal?.appid || import.meta.env.VITE_MATCHID_APP_ID,
  // );
  console.log("🔍 locale:", stateLocal);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShowPopup(false), 5000); // Auto-close after 5 sec
  //   return () => clearTimeout(timer);
  //   setShowPopup(false);
  // }, []);

  // useEffect(() => {
  //   // Inject Monetag script
  //   onRouteChange();

  //   // Debugging: Check if Monetag is available
  //   setTimeout(() => {
  //     if (typeof window.show_9079498 === "function") {
  //       console.log("✅ Monetag is available.");
  //     } else {
  //       console.warn("⚠️ Monetag not loaded yet.");
  //     }
  //   }, 5000);
  // }, []);

  useEffect(() => {
    // Inject OpenAD script
    injectOpenAd();

    // Debugging: Check if OpenAD is available
    setTimeout(() => {
      injectOpenAd().then(() => {
        if (window.openADJsSDK) {
          console.log("✅ OpenAD SDK is ready.");
        } else {
          console.warn("⚠️ OpenAD SDK failed to initialize.");
        }
      });
    }, 5000); // Wait 5 seconds to allow the script to load
  }, []);

  return (
    <WalletProvider>
      <Router>
        <Navbar
          showRewardedInterstitial={showRewardedInterstitial}
          showRewardedPopup={showRewardedPopup}
          showInAppAd={showInAppAd}
        />
        {showPopup && isAuthenticated && (
          <ActivityPopup closePopup={() => setShowPopup(false)} />
        )}
        <Routes>
          {!isAuthenticated ? (
            <Route path="*" element={<LoginScreen />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/trading" element={<Trading />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          )}
        </Routes>
      </Router>
    </WalletProvider>
  );
}
