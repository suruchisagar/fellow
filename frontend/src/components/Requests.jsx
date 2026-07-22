import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true });
      setRequests(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getRequests(); }, []);

  const handleReview = async (status, requestId) => {
    setActionLoading(requestId + status);
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: "#1A120F" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#1A120F" }}>
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 pt-20">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-1">
            Incoming
          </p>
          <div className="flex items-center gap-3">
            <h1 style={{ ...mono, color: "#FAF6F2" }} className="text-2xl font-bold tracking-tight">Requests</h1>
            {requests.length > 0 && (
              <span
                style={{ ...mono, background: "rgba(181,112,63,0.15)", border: "1px solid rgba(181,112,63,0.35)", color: "#D99A5B" }}
                className="text-xs font-bold px-2.5 py-1 rounded-lg"
              >
                {requests.length} pending
              </span>
            )}
          </div>
          <div className="mt-4 h-px" style={{ background: "#3A2A22" }} />
        </div>

        {/* ── Empty State ── */}
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#241914", border: "1px solid #3A2A22" }}
            >
              <span style={{ color: "#D99A5B" }} className="text-2xl">✓</span>
            </div>
            <div>
              <p style={{ ...mono, color: "#FAF6F2" }} className="font-bold text-base mb-1">No pending requests</p>
              <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">You're all caught up! Explore more developers.</p>
            </div>
            <button
              onClick={() => navigate("/feed")}
              style={{ ...mono, background: "#B5703F" }}
              className="text-[#1A120F] font-semibold px-6 py-2.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Back to Feed →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => {
              const user = req.fromUserId;
              return (
                <div
                  key={req._id}
                  className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200"
                  style={{ background: "#FAF6F2", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                >
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: "#E8DDD3" }}
                  >
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span style={{ ...mono, color: "#B5703F" }} className="font-bold text-base">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 style={{ ...mono, color: "#241914" }} className="font-bold text-base">
                        {user.firstName} {user.lastName}
                      </h2>
                      {user.skills?.[0] ? (
                        <span
                          style={{ ...mono, background: "#B5703F", color: "#FAF6F2" }}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                        >
                          {user.skills[0]}
                        </span>
                      ) : (
                        <span
                          style={{ ...mono, background: "#F2E9E4", color: "#9C8A80" }}
                          className="text-xs px-2.5 py-0.5 rounded-full"
                        >
                          wants to connect
                        </span>
                      )}
                    </div>
                    {user.about && (
                      <p style={{ ...mono, color: "#6E6A68" }} className="text-sm truncate">{user.about}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2.5 flex-shrink-0">
                    <button
                      onClick={() => handleReview("rejected", req._id)}
                      disabled={actionLoading !== null}
                      style={{ ...mono, background: "#FAF6F2", border: "1px solid #E8DDD3", color: "#4A423D" }}
                      className="font-semibold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 hover:border-[#D3C4B6]"
                    >
                      {actionLoading === req._id + "rejected" ? "..." : "✕ Reject"}
                    </button>
                    <button
                      onClick={() => handleReview("accepted", req._id)}
                      disabled={actionLoading !== null}
                      style={{ ...mono, background: "#B5703F" }}
                      className="text-[#FAF6F2] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-40 hover:opacity-90 active:scale-[0.98]"
                    >
                      {actionLoading === req._id + "accepted" ? "..." : "✓ Accept"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;