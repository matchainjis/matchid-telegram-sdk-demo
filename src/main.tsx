import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { WagmiProvider } from "wagmi";
import { MatchProvider } from "@matchain/matchid-sdk-react";
import { LocaleType } from "@matchain/matchid-sdk-react/types";
import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";

// ✅ Fix: Cast `globalThis` to avoid TypeScript error
if (typeof (globalThis as any).Buffer === "undefined") {
  (globalThis as any).Buffer = Buffer;
}

const getState = () => {
  if (window.localStorage.getItem("match-local")) {
    const localState = JSON.parse(
      window.localStorage.getItem("match-local") || "{}",
    );
    return localState.state;
  }
  return null;
};

const stateLocal = getState();

// const [locale, setLocale] = useState(
//  window.localStorage.getItem("locale") || "en",
// );

const locale: LocaleType | undefined =
  (window.localStorage.getItem("locale") as LocaleType | undefined) ||
  ("en" as LocaleType | undefined);

const queryClient = new QueryClient();

// useEffect(() => {
//   window.localStorage.setItem("locale", locale);
// }, [locale]);

window.localStorage.setItem("locale", locale || "en");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MatchProvider
            appid={stateLocal?.appid || import.meta.env.VITE_MATCHID_APP_ID}
            wallet={{ type: "UserPasscode" }}
            // endpoints={endpoints}
            locale={locale}
            events={{
              onLogin: (data) => {
                // console.log("MatchProvider: User Logged In", data);
                localStorage.setItem(
                  "wallet-connect-end-demo",
                  JSON.stringify(data),
                );
                // dispatch(
                //   setUser({
                //     mid: data?.mid,
                //     did: data?.did,
                //     token: data?.token,
                //   }),
                // );
              },
              onLogout: () => {
                console.log("MatchProvider: User Logged Out");
              },
              onBind: (data) => {
                console.log("MatchProvider: User Bound Info", data);
              },
            }}
          >
            <App stateLocal={stateLocal} />
          </MatchProvider>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
