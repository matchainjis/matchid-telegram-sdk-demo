import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 5173,
  //   host: true, // important for network access
  //   allowedHosts: ["XXX.ngrok-free.app"], // allow your ngrok subdomain
  // },
});
