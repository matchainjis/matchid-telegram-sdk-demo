import { http, createConfig } from "wagmi";
import { chains } from "./chains";
import { walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains,
  connectors: [
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: Object.fromEntries(
    chains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])]) // ✅ Assign transports dynamically
  ),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
