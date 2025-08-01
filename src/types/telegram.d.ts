export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: Record<string, any>; // Or provide a better type if you know the structure
        };
        openLink?: (
          url: string,
          options?: { try_instant_view?: boolean; try_browser?: boolean },
        ) => void;
        expand?: () => void;
      };
    };
  }
}
