import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import TelegramLogin from "../components/TelegramLogin";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  // console.log(`is authenticated: ${isAuthenticated}`);
  const matchid = useSelector((state: any) => state.auth.matchidAddress);
  console.log(`matchid: ${matchid}`);

  return (
    <div className="container">
      <h1>DeGen Space</h1>
      <p>Choose a service:</p>

      {/* ✅ Login Only if Not Authenticated */}
      {!isAuthenticated ? (
        <TelegramLogin />
      ) : (
        <div className="grid">
          <Card
            title="Trading Dashboard"
            onClick={() => navigate("/trading")}
          />
          <Card
            title="Assets Visualization"
            onClick={() => navigate("/assets")}
          />
          <Card title="Trading Signals" onClick={() => navigate("/signals")} />
          <Card title="Data Dashboard" onClick={() => navigate("/dashboard")} />
        </div>
      )}
    </div>
  );
}
