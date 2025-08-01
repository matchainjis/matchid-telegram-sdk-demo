import { useWallet } from "../context/WalletContext";
import { useReconnect, useAccount, useConnect, useDisconnect, useReadContracts } from "wagmi";
import { FaWallet, FaLink, FaUnlink } from "react-icons/fa";
import BackButton from "../components/BackButton";
import { chains } from "../chains";
import { useState, useEffect } from "react";
import { Address, Abi } from "viem";
import {
  USDT_CONTRACT,
  ETH_WETH_CONTRACT,
  FOMO_CONTRACT,
  MAD_CONTRACT,
  BNB_CONTRACT,
  USDT_ABI,
  ETH_WETH_ABI,
  FOMO_ABI,
  MAD_ABI,
  BNB_ABI,
} from "../tokensandnfts";
import { config } from "../wagmi.ts";

// ✅ Token List
const TOKEN_COLLECTIONS = [
  { name: "USDT", contract: USDT_CONTRACT as Address, abi: USDT_ABI, symbol: "USDT" },
  { name: "WETH", contract: ETH_WETH_CONTRACT as Address, abi: ETH_WETH_ABI, symbol: "WETH" },
  { name: "FOMO", contract: FOMO_CONTRACT as Address, abi: FOMO_ABI, symbol: "FOMO" },
  { name: "MAD", contract: MAD_CONTRACT as Address, abi: MAD_ABI, symbol: "MAD" },
  { name: "BNB", contract: BNB_CONTRACT as Address, abi: BNB_ABI, symbol: "BNB" },
];

export default function Assets() {
  const { walletData } = useWallet();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { reconnectAsync, isPending, isSuccess, isError } = useReconnect({ config });
  const { address, isConnected } = useAccount(); // ✅ Get latest wallet status

  const walletAddress = address || walletData?.addresses?.[0];
  const [balances, setBalances] = useState<{ name: string; balance: string; symbol: string }[]>([]);

  // ✅ Auto-Reconnect When App Resumes
  useEffect(() => {
    reconnectAsync();
  }, []);

  // ✅ Handle Failed Reconnects
  useEffect(() => {
    if (isError) {
      console.error("Failed to reconnect wallet.");
    }
  }, [isError]);

  // ✅ Handle Manual Reconnect
  const handleReconnect = async () => {
    try {
      const result = await reconnectAsync();
      console.log("Reconnection Result:", result);
    } catch (error) {
      console.error("Reconnection Failed:", error);
    }
  };

  // ✅ Get Chain Name
  const chain = chains.find((chain) => chain.id === walletData?.chainId);
  const chainName = chain ? chain.name : "Unknown Chain Name";
  const chainID = chain ? chain.id : "Unknown Chain ID";

  // ✅ Read all token balances in one batch request
  const { data: tokenBalances, isSuccess: hasBalances } = useReadContracts({
    contracts: TOKEN_COLLECTIONS.map((token) => ({
      address: token.contract,
      abi: token.abi as Abi,
      functionName: "balanceOf",
      args: [walletAddress as `0x${string}`], // ✅ Ensure args are correctly typed
    })),
  });

  // ✅ Fetch & Format Token Balances
  useEffect(() => {
    console.log("Wallet Address:", walletAddress);
    console.log("Raw Token Balances:", tokenBalances);

    if (!walletAddress || !hasBalances || !tokenBalances) {
      console.warn("No wallet address or token balances available");
      return;
    }

    // ✅ Define decimals for each token (adjust these based on your actual contract data)
    const TOKEN_DECIMALS: Record<string, number> = {
      USDT: 6,  // ✅ USDT uses 6 decimals
      WETH: 18,
      FOMO: 18,
      MAD: 18,
      BNB: 18,
    };

    const formattedBalances = tokenBalances.map((rawBalance, index) => {
      const token = TOKEN_COLLECTIONS[index];

      // ✅ Extract result safely
      const balanceRaw = rawBalance?.result ?? 0n; // Default to 0n if undefined
      console.log(`Token: ${token.name}, Raw Balance:`, balanceRaw);

      // ✅ Use the correct decimal precision
      const decimals = TOKEN_DECIMALS[token.name] || 18; // Default to 18 if not specified
      const balance =
        typeof balanceRaw === "bigint"
          ? (Number(balanceRaw) / 10 ** decimals).toFixed(4) // ✅ Convert properly
          : "0.0000";

      console.log(`Formatted ${token.name} Balance:`, balance);
      return { name: token.name, balance, symbol: token.symbol };
    });

    setBalances(formattedBalances);
  }, [tokenBalances, walletAddress, hasBalances]);


  return (
    <div className="container">
      <BackButton />
      <h2>Assets Visualization</h2>

      {/* ✅ Wallet Status */}
      <div className="account-status">
        <FaUnlink size={18} style={{ marginRight: "8px" }} /> <strong>Status:</strong> {isConnected ? "Connected" : "Reconnecting..."}
        <br />
        <FaWallet size={18} style={{ marginRight: "8px" }} /> <strong>Address:</strong>
        <span className="wallet-address">{JSON.stringify(walletAddress)}</span>
        <br />
        <FaLink size={18} style={{ marginRight: "8px" }} /> <strong>Chain:</strong> {chainName} ID: {chainID}
      </div>

      {/* ✅ Reconnect Status */}
      {isPending && <p>Reconnecting...</p>}
      {isSuccess && <p>Reconnected Successfully!</p>}
      {isError && <p style={{ color: "red" }}>Failed to Reconnect. Please reconnect manually.</p>}

      {/* ✅ Token Balances */}
      <h3>Token Balances</h3>
      <div className="wallet-box">
        {!walletAddress ? (
          <strong>Wallet Not Connected</strong>
        ) : balances.length === 0 ? (
          "Fetching token balances..."
        ) : (
          <ul>
            {balances.map((token, index) => (
              <li key={index}>
                <strong>{token.name}:</strong> {token.balance} {token.symbol}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Wallet Connection/Disconnect Buttons */}
      {isConnected ? (
        <button onClick={() => disconnect()}>Disconnect</button>
      ) : (
        <>
          <button onClick={handleReconnect} disabled={isPending}>
            {isPending ? "Reconnecting..." : "Reconnect Wallet"}
          </button>
          {connectors.map((connector) => (
            <button key={connector.uid} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
          ))}
        </>
      )}
    </div>
  );
}
