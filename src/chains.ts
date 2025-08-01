import { type Chain } from 'viem';

export const mainnet: Chain = {
  id: 1,
  name: "Ethereum",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://eth.merkle.io"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://etherscan.io" } },
};

export const sepolia: Chain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia.org"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://sepolia.etherscan.io" } },
};

export const matchain: Chain = {
  id: 698,
  name: "Matchain",
  nativeCurrency: { name: "MAT", symbol: "MAT", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.ankr.com/matchain_mainnet"] } },
  blockExplorers: { default: { name: "MatchScan", url: "https://matchscan.io" } },
};

export const bsc: Chain = {
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { default: { http: ["https://bsc-dataseed.binance.org"] } },
  blockExplorers: { default: { name: "BscScan", url: "https://bscscan.com" } },
};

export const bscTestnet: Chain = {
  id: 97,
  name: "BNB Smart Chain Testnet",
  nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: { default: { http: ["https://data-seed-prebsc-1-s1.binance.org:8545"] } },
  blockExplorers: { default: { name: "BscScan", url: "https://testnet.bscscan.com" } },
};

// ✅ Export chains as a tuple
export const chains: readonly [Chain, ...Chain[]] = [mainnet, sepolia, matchain, bsc, bscTestnet];
