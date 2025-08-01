// import PromiseLoadScript from "./PromiseLoadScript";

// // Constants for ad tracking
// const MAX_AD_CLICKS = 4;
// const STORAGE_KEY = "openAdClicks";
// const DATE_KEY = "lastAdDate";
// const OPENAD_ZONE_ID = 384; // ✅ Your Zone ID
// const OPENAD_PUBLISHER_ID = 444; // ✅ Your Publisher ID

// const adParams = {
//   version: "v3", // ✅ Match OpenAD documentation
//   TG: true, // ✅ Set true ONLY for Telegram Mini Apps
// };

// const userInfo = {
//   userId: "",
//   firstName: "",
//   lastName: "",
//   userName: "",
//   walletType: "",
//   walletAddress: "",
// };

// /**
//  * Ensures OpenAD SDK is loaded before use.
//  */
// export async function injectOpenAd(): Promise<void> {
//   if (window.openADJsSDK) {
//     console.log("✅ OpenAD SDK already loaded.");
//     return;
//   }

//   console.log("🚀 Injecting OpenAD SDK...");
//   try {
//     await PromiseLoadScript({
//       url: "https://protocol.openad.network/sdk/loader.js?v=3.4.0",
//       name: "openADJsSDK",
//       version: "3.4.0",
//       noCache: true,
//     });

//     console.log("✅ OpenAD script loaded successfully!");
//   } catch (error) {
//     console.error("❌ Failed to load OpenAD script:", error);
//   }
// }

// /**
//  * Ensures OpenAD SDK is available.
//  */
// async function ensureOpenAD(): Promise<OpenADJsSDK | null> {
//   if (!window.openADJsSDK) {
//     await injectOpenAd();
//   }
//   return window.openADJsSDK ? (window.openADJsSDK as OpenADJsSDK) : null;
// }

// /**
//  * Checks if an ad can be shown based on the daily limit.
//  */
// function canShowAd(): boolean {
//   const today = new Date().toISOString().split("T")[0];
//   const lastDate = localStorage.getItem(DATE_KEY);
//   let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");

//   if (lastDate !== today) {
//     // Reset the counter if a new day starts
//     localStorage.setItem(STORAGE_KEY, "0");
//     localStorage.setItem(DATE_KEY, today);
//     adClicks = 0;
//   }

//   return adClicks < MAX_AD_CLICKS;
// }

// /**
//  * Tracks an ad click in local storage.
//  */
// function trackAdClick(): void {
//   let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");
//   localStorage.setItem(STORAGE_KEY, (adClicks + 1).toString());
// }

// /**
//  * Shows an interactive OpenAD ad.
//  */
// export async function showOpenAdPopup(): Promise<void> {
//   if (!canShowAd()) {
//     alert("🚫 You have reached the max ad views for today.");
//     return;
//   }

//   const openAD = await ensureOpenAD();
//   if (!openAD) {
//     console.warn("⚠️ OpenAD SDK not available.");
//     return;
//   }

//   const adInfo = {
//     zoneId: OPENAD_ZONE_ID,
//     publisherId: OPENAD_PUBLISHER_ID,
//     eventId: 0,
//   };

//   try {
//     // ✅ First, initialize the interactive ad
//     const initResult = await openAD.interactive.init({
//       adParams,
//       adInfo,
//       userInfo,
//     });

//     console.log(initResult);

//     if (initResult.code !== 0) {
//       console.warn("❌ OpenAD Interactive init failed:", initResult.msg);
//       return;
//     }

//     // ✅ If init succeeds, render the ad
//     openAD.interactive.getRender({
//       adInfo,
//       cb: {
//         adResourceLoad: (e: boolean) =>
//           console.log("🔍 Ad Resource Loaded:", e),
//         adOpening: (e: boolean) => console.log("🚀 Ad is Opening:", e),
//         adOpened: (e: string) => console.log("✅ Interactive Ad Opened:", e),
//         adTaskFinished: (e: string) => console.log("✅ Ad Task Completed:", e),
//         adClosing: (e: string) => console.log("🔴 Ad is Closing:", e),
//         adClosed: (e: string) => {
//           console.log("✅ Interactive Ad Closed:", e);
//           trackAdClick(); // ✅ Track ad interaction
//         },
//         adClick: (e: boolean) => console.log("🎯 Ad Clicked:", e),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error showing OpenAD interactive ad:", error);
//   }
// }

// /**
//  * Shows a banner ad.
//  */
// export async function showOpenAdBanner(): Promise<void> {
//   const openAD = await ensureOpenAD();
//   if (!openAD || !openAD.bridge || !openAD.bridge.get || !openAD.bridge.click) {
//     console.error("❌ OpenAD SDK is missing required methods.");
//     return;
//   }

//   const adInfo = {
//     zoneId: OPENAD_ZONE_ID,
//     publisherId: OPENAD_PUBLISHER_ID,
//     eventId: 0,
//   };

//   try {
//     // ✅ Fetch the banner ad data
//     const res = await openAD.bridge.get({ adInfo, adParams });

//     if (res.code === 0 && res.data) {
//       console.log("✅ OpenAD Banner Loaded:", res);

//       // ✅ Display the banner ad (your UI should handle rendering)
//       // Example: `document.getElementById("ad-container").innerHTML = res.data.html;`

//       // ✅ Track the ad impression
//       await openAD.bridge.log(adInfo);

//       // ✅ Track the ad view
//       trackAdClick();
//     } else {
//       console.warn("⚠️ No ads available:", res.msg);
//     }
//   } catch (error) {
//     console.error("❌ Error fetching OpenAD banner ad:", error);
//   }
// }

// /**
//  * Tracks a banner ad click.
//  */
// export function trackBannerAdClick(): void {
//   const openAD = window.openADJsSDK;
//   if (!openAD || !openAD.bridge || !openAD.bridge.click) {
//     console.error("❌ OpenAD SDK is missing required methods.");
//     return;
//   }

//   const adInfo = {
//     zoneId: OPENAD_ZONE_ID,
//     publisherId: OPENAD_PUBLISHER_ID,
//     eventId: 0,
//   };

//   try {
//     openAD.bridge.click(adInfo);
//     console.log("🎯 Banner Ad Click Tracked");
//   } catch (error) {
//     console.error("❌ Error tracking OpenAD banner click:", error);
//   }
// }

import PromiseLoadScript from "./PromiseLoadScript";

// Constants for ad tracking
// const MAX_AD_CLICKS = 3;
const STORAGE_KEY = "openAdClicks";
// const DATE_KEY = "lastAdDate";
const OPENAD_ZONE_ID = 159; // ✅ Your Zone ID
const OPENAD_PUBLISHER_ID = 49; // ✅ Your Publisher ID

const adParams = {
  version: "v3", // ✅ Match OpenAD documentation
  TG: true, // ✅ Set true ONLY for Telegram Mini Apps
};

// ✅ Mandatory userInfo parameters (can be left blank if unknown)
const userInfo = {
  userId: "", // User ID, can be blank
  firstName: "",
  lastName: "",
  userName: "",
  walletType: "",
  walletAddress: "",
};

/**
 * Checks if an ad can be shown based on daily limits.
 */
// function canShowAd(): boolean {
//   const today = new Date().toISOString().split("T")[0];
//   const lastDate = localStorage.getItem(DATE_KEY);
//   let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");

//   if (lastDate !== today) {
//     // Reset the counter if a new day starts
//     localStorage.setItem(STORAGE_KEY, "0");
//     localStorage.setItem(DATE_KEY, today);
//     adClicks = 0;
//   }

//   return adClicks < MAX_AD_CLICKS;
// }

/**
 * Tracks an ad click in local storage.
 */
function trackAdClick(): void {
  let adClicks = Number(localStorage.getItem(STORAGE_KEY) || "0");
  localStorage.setItem(STORAGE_KEY, (adClicks + 1).toString());
}

/**
 * Ensures that the OpenAD SDK is loaded before calling any ad functions.
 */
// let initRes;
export async function injectOpenAd(): Promise<void> {
  if (window.openADJsSDK) {
    console.log("✅ OpenAD SDK already loaded.");
    return;
  }

  console.log("🚀 Injecting OpenAD SDK...");
  try {
    await PromiseLoadScript({
      url: "https://protocol.openad.network/sdk/loader.js?v=3.4.0",
      name: "openADJsSDK",
      version: "3.4.0",
      noCache: true,
    });

    console.log("✅ OpenAD script loaded successfully!");

    if (window.openADJsSDK) {
      const openAD = window.openADJsSDK as OpenADJsSDK;

      const adInfo = {
        zoneId: OPENAD_ZONE_ID,
        publisherId: OPENAD_PUBLISHER_ID,
        eventId: 0,
      };

      const initResult = await openAD.init({ adParams, adInfo, userInfo });

      console.log(initResult);

      setTimeout(() => {
        console.log(initResult);
      }, 10000); // Wait 5 seconds to allow the script to load

      if (initResult.code === 0) {
        console.log("✅ OpenAD initialized successfully!");
      } else {
        console.error("❌ OpenAD initialization failed:", initResult.msg);
      }
    }
  } catch (error) {
    console.error("❌ Failed to load OpenAD script:", error);
  }
}

/**
 * Ensures OpenAD SDK is available before using it.
 */
async function ensureOpenAD(): Promise<OpenADJsSDK | null> {
  if (!window.openADJsSDK) {
    await injectOpenAd();
  }
  return window.openADJsSDK ? (window.openADJsSDK as OpenADJsSDK) : null;
}

/**
 * Displays an interactive OpenAD popup.
 */
export async function showOpenAdInteractive(): Promise<void> {
  // if (!canShowAd()) {
  //   alert("🚫 Daily ad limit reached.");
  //   return;
  // }

  const openAD = await ensureOpenAD();
  if (!openAD) {
    console.warn("⚠️ OpenAD SDK not available.");
    return;
  }

  const adInfo = {
    zoneId: OPENAD_ZONE_ID,
    publisherId: OPENAD_PUBLISHER_ID,
    eventId: 0,
  };

  openAD.interactive.getRender({
    adInfo,
    cb: {
      adOpened: (e: string) => console.log("✅ Interactive Ad Opened:", e),
      adClosed: (e: string) => {
        console.log("✅ Interactive Ad Closed:", e);
      },
      adTaskFinished: (e: string) => {
        console.log("✅ Ad Task Completed:", e);
        trackAdClick(); // ✅ Track clicks only if the ad is completed
      },
    },
  });
}

/**
 * Displays an interstitial ad.
 */
// export async function showOpenAdInterstitial(): Promise<void> {
//   // if (!canShowAd()) {
//   //   alert("🚫 Daily ad limit reached.");
//   //   return;
//   // }

//   const openAD = await ensureOpenAD();
//   if (!openAD) {
//     console.warn("⚠️ OpenAD SDK not available.");
//     return;
//   }

//   const adInfo = {
//     zoneId: OPENAD_ZONE_ID,
//     publisherId: OPENAD_PUBLISHER_ID,
//     eventId: 0,
//   };

//   openAD.interactive.getRender({
//     adInfo,
//     cb: {
//       adOpened: (e: string) => console.log("✅ Interstitial Ad Opened:", e),
//       adClosed: (e: string) => {
//         console.log("✅ Interstitial Ad Closed:", e);
//         trackAdClick(); // ✅ Track clicks when the ad is closed
//       },
//     },
//   });
// }

/**
 * Displays a standard OpenAD.
 */
export async function showOpenAdBanner(): Promise<void> {
  // if (!canShowAd()) {
  //   alert("🚫 Daily ad limit reached.");
  //   return;
  // }

  const openAD = await ensureOpenAD();
  if (!openAD) {
    console.warn("⚠️ OpenAD SDK not available.");
    return;
  }

  const adInfo = {
    zoneId: OPENAD_ZONE_ID,
    publisherId: OPENAD_PUBLISHER_ID,
    eventId: 0,
  };

  try {
    const res = await openAD.bridge.get({ adInfo, adParams });
    if (res.code === 0) {
      console.log("✅ OpenAD Banner Loaded:", res);
      openAD.bridge.click(adInfo);
      trackAdClick(); // ✅ Track clicks after a successful banner ad load
    } else {
      console.warn("⚠️ No ads available:", res.msg);
    }
  } catch (error) {
    console.error("❌ Error loading OpenAD:", error);
  }
}
