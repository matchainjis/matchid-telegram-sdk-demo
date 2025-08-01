import BackButton from "../components/BackButton";

export default function Signals() {
  return (
    <div className="container">
      <BackButton />
      <h2>Trading Signals</h2>
      <p>🚀 Get the latest trading signals here!</p>
      <ul>
        <li>📈 BTC/USD: Buy at $42,000</li>
        <li>📉 ETH/USD: Sell at $2,900</li>
        <li>⚡ BNB/USD: Hold for now</li>
      </ul>
    </div>
  );
}
