import { createContext, useContext, useState } from "react";
import { useAccount, UseAccountReturnType, Config } from "wagmi";

// Define WalletContext Type
type WalletContextType = {
  walletData: UseAccountReturnType<Config>;
  setWalletData: React.Dispatch<React.SetStateAction<UseAccountReturnType<Config>>>;
};

// ✅ Provide a default value to avoid `null` issues
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Context Provider
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const account = useAccount<Config>(); // ✅ Explicitly type it
  const [walletData, setWalletData] = useState<UseAccountReturnType<Config>>(account);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom Hook to Access Wallet Data
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
