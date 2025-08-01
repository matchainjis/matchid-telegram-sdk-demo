import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartLine,
  FaWallet,
  FaSignal,
  FaTachometerAlt,
} from "react-icons/fa";

interface NavbarProps {
  showRewardedInterstitial: (callback: () => void) => void;
  showRewardedPopup: (callback: () => void) => void;
  showInAppAd: () => void;
}

export default function Navbar({
  // showRewardedInterstitial,
  // showRewardedPopup,
  showInAppAd,
}: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate(); // Allows manual redirection after ad plays

  // Function to check if a link is active
  const isActive = (path: string) =>
    location.pathname === path ? "active" : "";

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className={isActive("/")}>
          <FaHome size={24} />
        </Link>
        {/* Trading Page with Interstitial Ad Before Navigation */}
        {/* <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showRewardedInterstitial(() => navigate("/trading"));
          }}
          className={isActive("/trading")}
        >
          <FaChartLine size={24} />
        </a> */}
        <Link to="/trading" className={isActive("/trading")}>
          <FaChartLine size={24} />
        </Link>
        {/* Assets Page with Popup Ad Before Navigation */}
        {/* <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showRewardedPopup(() => navigate("/assets"));
          }}
          className={isActive("/assets")}
        >
          <FaWallet size={24} />
        </a> */}
        <Link to="/assets" className={isActive("/assets")}>
          <FaWallet size={24} />
        </Link>
        {/* Signals Page (No Ad) */}
        <Link to="/signals" className={isActive("/signals")}>
          <FaSignal size={24} />
        </Link>
        {/* Dashboard Page with In-App Ads (No Delay) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            showInAppAd();
            navigate("/dashboard"); // Navigate immediately
          }}
          className={isActive("/dashboard")}
        >
          <FaTachometerAlt size={24} />
        </a>
      </div>
    </nav>
  );
}
