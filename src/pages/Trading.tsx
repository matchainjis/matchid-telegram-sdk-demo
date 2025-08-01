// import { useEffect, useState } from "react";
// import BackButton from "../components/BackButton";
// import {
//   showOpenAdPopup,
//   showOpenAdBanner,
//   trackBannerAdClick,
// } from "../utils/openAdUtils";

// export default function Trading() {
//   const [bannerAdLoaded, setBannerAdLoaded] = useState(false);
//   useEffect(() => {
//     async function loadBannerAd() {
//       try {
//         await showOpenAdBanner();
//         setBannerAdLoaded(true);
//       } catch (error) {
//         console.error("❌ Failed to load banner ad:", error);
//       }
//     }

//     loadBannerAd();
//   }, []);
//   return (
//     <div className="container">
//       <BackButton />
//       <h2>Trading Interface</h2>
//       <p>🔄 Buy & Sell cryptocurrencies here.</p>
//       {/* Interactive OpenAD */}
//       <button onClick={showOpenAdPopup}>🔔 Show OpenAd Popup</button>
//       {/* Banner Ad */}
//       {bannerAdLoaded ? (
//         <div
//           id="ad-container"
//           onClick={trackBannerAdClick} // ✅ Track the click event
//           style={{
//             cursor: "pointer",
//             padding: "10px",
//             background: "#f4f4f4",
//             textAlign: "center",
//           }}
//         >
//           📢 OpenAd Banner - Click to Track
//         </div>
//       ) : (
//         <p>Loading banner ad...</p>
//       )}

//       <hr />
//       {/* Other Trading Actions */}
//       <button>📈 Buy</button>
//       <button>📉 Sell</button>
//       <button>🔄 Swap</button>
//     </div>
//   );
// }

import { showOpenAdInteractive, showOpenAdBanner } from "../utils/openAdUtils";

export default function Trading() {
  return (
    <div className="container">
      {/* OpenAd Ads */}
      <button onClick={showOpenAdInteractive}>🎯 Show OpenAd Interative</button>
      <button onClick={showOpenAdBanner}>🔔 Show OpenAd Banner</button>
    </div>
  );
}
