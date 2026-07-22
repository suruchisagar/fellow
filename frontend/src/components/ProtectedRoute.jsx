import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
        setAuthenticated(true);
      } catch {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) {
    return (
      <div className="h-screen w-screen bg-[#0a1628] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#2a5a6e] text-sm">Verifying session...</p>
      </div>
    );
  }

  return authenticated ? children : null;
};

export default ProtectedRoute;