import { useState, useEffect, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContracts,
} from "wagmi";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { Abi, Address } from "viem"; // ✅ Import Abi type
import { CW_NFT_CONTRACT, CW_NFT_ABI } from "../tokensandnfts";
import { useSelector } from "react-redux";
import axios from "axios";
import "./ActivityPopup.css";
import nftPromo from "../assets/nft-promo.png";

export const NFT_COLLECTIONS = [
  {
    name: "Crypto Whale",
    contract: CW_NFT_CONTRACT as Address,
    abi: CW_NFT_ABI as Abi, // ✅ Explicitly type ABI
  },
];

export default function ActivityPopup({
  closePopup,
}: {
  closePopup: () => void;
}) {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  const { walletData } = useWallet();
  const walletConnected = walletData?.status === "connected";
  const navigate = useNavigate();

  // 👇 Hide popup if not logged in
  if (!isAuthenticated) return null;

  const [index, setIndex] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [nftImages, setNftImages] = useState<string[]>(
    NFT_COLLECTIONS.map(() => nftPromo),
  );
  const carouselRef = useRef<HTMLDivElement>(null);
  const [nftTitle, setNftTitle] = useState<string>(NFT_COLLECTIONS[0].name);

  // ✅ Fetch NFT Metadata using useReadContracts
  const { data: tokenUris } = useReadContracts({
    contracts: NFT_COLLECTIONS.map((nft) => ({
      address: nft.contract,
      abi: nft.abi,
      functionName: "tokenURI",
      args: [0],
    })),
  });

  // ✅ Process NFT Metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!tokenUris || !Array.isArray(tokenUris)) return;

      const metadataResults = await Promise.all(
        tokenUris.map(async (uri, idx) => {
          const uriStr = (uri?.result as string) || ""; // ✅ Safely extract the result
          if (!uriStr) return nftPromo;

          let formattedUri = uriStr.startsWith("ipfs://")
            ? uriStr.replace("ipfs://", "https://ipfs.io/ipfs/")
            : uriStr;

          try {
            const { data } = await axios.get(formattedUri);
            return data.image || nftPromo;
          } catch (error) {
            console.error(
              `Error fetching metadata for ${NFT_COLLECTIONS[idx].name}:`,
              error,
            );
            return nftPromo;
          }
        }),
      );

      setNftImages(metadataResults);
    };

    fetchMetadata();
  }, [tokenUris]);

  // ✅ Carousel Handling
  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;

      const scrollLeft = carouselRef.current.scrollLeft;
      const scrollWidth = carouselRef.current.clientWidth;

      // ✅ Find the closest index to center
      const newIndex = Math.round(scrollLeft / scrollWidth);
      setIndex(newIndex);
      setNftTitle(NFT_COLLECTIONS[newIndex].name);
    };

    const carousel = carouselRef.current;
    carousel?.addEventListener("scroll", handleScroll);

    return () => {
      carousel?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ Auto-Scroll Carousel
  useEffect(() => {
    let isManualScroll = false;

    const interval = setInterval(() => {
      if (isManualScroll) {
        isManualScroll = false;
        return;
      }

      setIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % NFT_COLLECTIONS.length;
        setNftTitle(NFT_COLLECTIONS[nextIndex].name);
        return nextIndex;
      });

      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.clientWidth;
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });

        setTimeout(() => {
          if (carouselRef.current) {
            const maxScroll = scrollAmount * (NFT_COLLECTIONS.length - 1);
            if (carouselRef.current.scrollLeft >= maxScroll) {
              carouselRef.current.scrollTo({ left: 0, behavior: "instant" });
            }
          }
        }, 600);
      }
    }, 3000);

    const handleUserScroll = () => {
      isManualScroll = true;
      setTimeout(() => (isManualScroll = false), 2000);
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener("scroll", handleUserScroll);
    }

    return () => {
      clearInterval(interval);
      if (carouselRef.current) {
        carouselRef.current.removeEventListener("scroll", handleUserScroll);
      }
    };
  }, []);

  const currentNFT = NFT_COLLECTIONS[index];

  // ✅ Minting Logic
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const mintNFT = async () => {
    if (!walletConnected) {
      closePopup();
      navigate("/assets");
      return;
    }
    setIsMinting(true);
    writeContract({
      address: currentNFT.contract,
      abi: currentNFT.abi,
      functionName: "mint",
      args: [],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsMinted(true);
      setIsMinting(false);
    }
  }, [isConfirmed]);

  return (
    <>
      {/* ✅ Fullscreen Backdrop */}
      <div className="activity-backdrop" onClick={closePopup}></div>

      {/* ✅ Popup */}
      <div className="activity-popup">
        <div className="popup-content">
          <h3>{nftTitle}</h3>

          {/* ✅ Scrollable Carousel */}
          <div className="nft-carousel" ref={carouselRef}>
            {NFT_COLLECTIONS.map((nft, idx) => (
              <div
                key={idx}
                className={`nft-item ${idx === index ? "active" : ""}`}
              >
                <img src={nftImages[idx]} alt={nft.name} />
              </div>
            ))}
          </div>

          {/* ✅ Dots Indicator */}
          <div className="carousel-dots">
            {NFT_COLLECTIONS.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === index ? "active" : ""}`}
              />
            ))}
          </div>

          {/* ✅ Minting Status */}
          {isConfirming && <p>Waiting for confirmation...</p>}
          {hash && <p>Transaction Hash: {hash}</p>}
          {isMinted && <p>Mint Successful!</p>}

          {/* ✅ Mint Button */}
          <button onClick={mintNFT} disabled={isMinting || isPending}>
            {isMinted
              ? "View NFT"
              : isMinting || isPending
                ? "Minting..."
                : "Go Mint"}
          </button>

          {/* ✅ Close Button */}
          <button onClick={closePopup}>Close</button>
        </div>
      </div>
    </>
  );
}
