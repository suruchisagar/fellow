import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;


const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      setConnections(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getConnections(); }, []);

  // ── Loading ──
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#2a5a6e] text-sm">Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#0a1628] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 pt-6">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs text-[#1D9E75] font-semibold uppercase tracking-widest mb-1">Your network</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-bold text-[#e8f4f8] tracking-tight">Connections</h1>
            {connections.length > 0 && (
              <span className="text-xs text-[#2a5a6e] mb-0.5">
                {connections.length} developer{connections.length > 1 ? "s" : ""} in your circle
              </span>
            )}
          </div>
          {/* Divider */}
          <div className="mt-4 h-px bg-[#1a3a4a]" />
        </div>

        {/* ── Empty State ── */}
        {connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0d1b2a] border border-[#1a3a4a] flex items-center justify-center">
              <span className="text-[#1D9E75] text-2xl">⊘</span>
            </div>
            <div>
              <p className="text-[#e8f4f8] font-bold text-base mb-1">No connections yet</p>
              <p className="text-[#2a5a6e] text-sm">Go explore developers on the feed and start connecting!</p>
            </div>
            <button
              onClick={() => navigate("/feed")}
              className="bg-[#0f6e56] hover:bg-[#0d5f4a] active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#0f6e56]/20"
            >
              Back to Feed →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {connections.map((user) => (
              <div
                key={user._id}
                className="group bg-[#0d1b2a] border border-[#1a3a4a] hover:border-[#1D9E75]/40 rounded-2xl p-4 flex items-center gap-4 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-[#0f6e56]/10 border border-[#0f6e56]/30 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#1D9E75] font-bold text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-[#e8f4f8] font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.about && (
                    <p className="text-[#2a5a6e] text-xs mt-0.5 truncate">{user.about}</p>
                  )}
                  {user.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {user.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[#5DCAA5] bg-[#1D9E75]/10 border border-[#1D9E75]/20 text-xs px-2.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="text-[#2a5a6e] text-xs px-1 py-0.5">
                          +{user.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Button */}
                <button
                  onClick={() => navigate(`/chat/${user._id}`)}
                  className="flex-shrink-0 bg-transparent border border-[#1a3a4a] group-hover:bg-[#0f6e56] group-hover:border-[#0f6e56] text-[#2a6a5a] group-hover:text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all duration-200"
                >
                  Chat →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;