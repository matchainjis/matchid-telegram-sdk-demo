import { useWallet } from "../context/WalletContext";
import { useReconnect, useAccount, useReadContracts } from "wagmi"; // ✅ Use Wagmi Hooks
import { FaWallet, FaTimesCircle, FaImage } from "react-icons/fa";
import BackButton from "../components/BackButton";
import { Address, Abi } from "viem";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useSelector } from "react-redux";
import { Hooks } from "@matchain/matchid-sdk-react";
import axios from "axios";
import {
  PS19_NFT_CONTRACT,
  PS19_NFT_ABI,
  CW_NFT_CONTRACT,
  CW_NFT_ABI,
} from "../tokensandnfts";

// ✅ NFT Collections
const NFT_COLLECTIONS = [
  {
    name: "PS19 NFT",
    contract: PS19_NFT_CONTRACT as Address,
    abi: PS19_NFT_ABI as Abi,
  },
  {
    name: "Crypto Whale NFT",
    contract: CW_NFT_CONTRACT as Address,
    abi: CW_NFT_ABI as Abi,
  },
];

export default function Dashboard() {
  const { useUserInfo } = Hooks;
  const { logout: MatchIDSDKLogout } = useUserInfo();
  const dispatch = useDispatch();
  const { walletData } = useWallet();
  const { reconnectAsync, isPending, isError } = useReconnect();
  const { address, isConnected } = useAccount(); // ✅ Track real-time wallet status
  const authState = useSelector((state: any) => state.auth);
  const matchidAddress = useSelector((state: any) => state.auth.matchidAddress);

  const walletAddress = address || walletData?.addresses?.[0];
  const [nfts, setNfts] = useState<{ name: string; tokenUri: string | null }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // console.log("🔍 Auth state from Redux:", authState);
  }, [authState]);

  // ✅ Auto-Reconnect When App Resumes
  useEffect(() => {
    reconnectAsync();
  }, []);

  // ✅ Handle Reconnection Errors
  useEffect(() => {
    if (isError) {
      console.error("Failed to reconnect wallet.");
    }
  }, [isError]);

  // ✅ Fetch NFT Balances
  const { data: nftBalances, isSuccess } = useReadContracts({
    contracts: NFT_COLLECTIONS.map((nft) => ({
      address: nft.contract as Address,
      abi: nft.abi as Abi,
      functionName: "balanceOf",
      args: [walletAddress as `0x${string}`],
    })),
  });

  // ✅ Fetch NFT Metadata
  useEffect(() => {
    async function fetchNFTs() {
      if (!walletAddress || !isSuccess || !nftBalances) return;

      setLoading(true);
      setError(false);

      try {
        const allOwnedNFTs: { name: string; tokenUri: string | null }[] = [];

        for (let i = 0; i < NFT_COLLECTIONS.length; i++) {
          const balance = nftBalances[i];

          if (balance && typeof balance === "bigint" && Number(balance) > 0) {
            const tokenURIsResult = useReadContracts({
              contracts: Array.from({ length: Number(balance) }, (_, idx) => ({
                address: NFT_COLLECTIONS[i].contract as Address,
                abi: NFT_COLLECTIONS[i].abi as Abi,
                functionName: "tokenURI",
                args: [idx],
              })),
            });

            // ✅ Handle Possible Undefined Data
            const tokenURIs: string[] = tokenURIsResult?.data
              ? tokenURIsResult.data.map((res: { result?: unknown }) =>
                  typeof res.result === "string" ? res.result : "",
                )
              : [];

            // ✅ Fetch metadata from IPFS
            const metadataResults = await Promise.all(
              tokenURIs.map(async (uri: string) => {
                if (!uri) return null;
                try {
                  const response = await axios.get(uri);
                  return response.data.image || null;
                } catch {
                  return null;
                }
              }),
            );

            // ✅ Map Metadata to NFTs
            allOwnedNFTs.push(
              ...metadataResults.map((image: string | null) => ({
                name: NFT_COLLECTIONS[i].name,
                tokenUri: image,
              })),
            );
          }
        }

        setNfts(allOwnedNFTs);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
        setError(true);
      }

      setLoading(false);
    }

    fetchNFTs();
  }, [walletAddress, isSuccess, nftBalances]);

  return (
    <div className="container">
      <BackButton />
      <h2>Dashboard</h2>

      <div className="logout-container">
        <button
          className="logout-btn"
          onClick={async () => {
            try {
              await MatchIDSDKLogout(); // Logout from MatchID SDK
              dispatch(logout()); // Clear Redux state
              console.log("✅ Successfully logged out");
            } catch (error) {
              console.error("❌ Logout failed:", error);
            }
          }}
        >
          🔓 Logout
        </button>
      </div>

      <p>
        <strong>MatchID Address:</strong> {matchidAddress}
      </p>

      {/* ✅ Wallet Status (Fixed) */}
      <div className="account-status">
        <FaWallet size={18} style={{ marginRight: "8px" }} />
        <strong>Wallet Status:</strong>{" "}
        {isConnected ? "Connected" : "Reconnecting..."}
        <br />
        <strong>Connected Address:</strong>
        <div className="wallet-box">{JSON.stringify(walletAddress)}</div>
      </div>

      {/* ✅ Reconnect Status */}
      {isPending && <p>Reconnecting...</p>}
      {isError && (
        <p style={{ color: "red" }}>
          Failed to Reconnect. Please reconnect manually.
        </p>
      )}

      {/* ✅ NFTs Section */}
      <h3>Owned NFTs</h3>
      <div className="wallet-box">
        {!isConnected ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaTimesCircle size={18} color="red" />
            <strong>Wallet not connected</strong>
          </div>
        ) : loading ? (
          "Loading NFTs..."
        ) : error ? (
          "Error fetching NFTs"
        ) : nfts.length > 0 ? (
          <ul>
            {nfts.map((nft, index) => (
              <li key={index} className="nft-item">
                <FaImage size={18} style={{ marginRight: "8px" }} />
                <strong>
                  {nft.name} #{index + 1}
                </strong>
                {nft.tokenUri && (
                  <img src={nft.tokenUri} alt={`${nft.name} NFT`} width={100} />
                )}
              </li>
            ))}
          </ul>
        ) : (
          "No NFTs found"
        )}
      </div>
    </div>
  );
}
