import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "/api";

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const Feed = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      setUsers(res.data.data);
    } catch (err) {
      setError("Failed to load feed. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getFeed(); }, []);

  const handleAction = async (status, userId) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${userId}`, {}, { withCredentials: true });
    } catch (err) {
      console.error(err);
    } finally {
      setCurrentIndex((prev) => prev + 1);
      setActionLoading(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: "#1A120F" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Loading developers...</p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-5 px-4" style={{ background: "#1A120F" }}>
        <div className="rounded-2xl px-8 py-7 max-w-sm w-full text-center" style={{ background: "#241914", border: "1px solid #3A2A22" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)" }}>
            <span className="text-red-400 text-xl">✕</span>
          </div>
          <p style={{ ...mono, color: "#F2E9E4" }} className="text-sm font-semibold mb-1">Something went wrong</p>
          <p style={{ ...mono, color: "#9C8A80" }} className="text-xs mb-5">{error}</p>
          <button
            onClick={() => navigate("/login")}
            style={{ ...mono, background: "#B5703F" }}
            className="w-full text-[#1A120F] font-semibold py-2.5 rounded-xl text-sm transition-all hover:opacity-90"
          >
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  const currentUser = users[currentIndex];

  // ── Empty ──
  if (!currentUser) {
    return (
      <div className="h-screen w-full flex flex-col overflow-hidden" style={{ background: "#1A120F" }}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 min-h-0">
          <div className="rounded-2xl px-8 py-10 max-w-sm w-full text-center" style={{ background: "#241914", border: "1px solid #3A2A22" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(181,112,63,0.15)", border: "1px solid rgba(181,112,63,0.35)" }}>
              <span style={{ color: "#D99A5B" }} className="text-2xl">✓</span>
            </div>
            <h3 style={{ ...mono, color: "#F2E9E4" }} className="text-lg font-bold mb-2 tracking-tight">You're all caught up!</h3>
            <p style={{ ...mono, color: "#9C8A80" }} className="text-sm mb-6 leading-relaxed">No more developers to show. Check back later or view your connections.</p>
            <button
              onClick={() => navigate("/connections")}
              style={{ ...mono, background: "#B5703F" }}
              className="w-full text-[#1A120F] font-semibold py-3 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              View Connections →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`;
  const progressPct = ((currentIndex + 1) / users.length) * 100;

  // ── Main Feed ──
  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ background: "#1A120F" }}>
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-14 min-h-0 overflow-hidden">
        <div className="w-full max-w-6xl flex gap-8 items-center h-full py-3">

          {/* ── Left column: list ── */}
          <div className="hidden lg:flex flex-col gap-5 w-60 flex-shrink-0">
            <p style={{ ...mono, color: "#D99A5B" }} className="text-xs font-semibold uppercase tracking-widest">
              Now reviewing
            </p>

            <div className="flex flex-col gap-3">
              {users.slice(currentIndex, currentIndex + 3).map((u, i) => (
                <div key={u._id} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden"
                    style={{
                      background: "#3A2A22",
                      color: "#D99A5B",
                      border: i === 0 ? "2px solid #B5703F" : "1px solid #3A2A22",
                    }}
                  >
                    {u.photoUrl ? (
                      <img src={u.photoUrl} alt={u.firstName} className="w-full h-full object-cover" />
                    ) : (
                      `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ ...mono, color: i === 0 ? "#F2E9E4" : "#9C8A80" }}
                    >
                      {u.firstName} {u.lastName}
                    </p>
                    <p style={{ ...mono, color: "#6E6A68" }} className="text-xs truncate">
                      {u.skills?.[0] ?? "Developer"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Progress</p>
                <p style={{ ...mono, color: "#F2E9E4" }} className="text-xs font-semibold">
                  {currentIndex + 1} / {users.length}
                </p>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "#241914" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: "#B5703F" }}
                />
              </div>
            </div>
          </div>

          {/* ── Center: white card ── */}
          <div className="flex-1 flex items-center justify-center min-h-0 h-full overflow-hidden">
            <div
              className="w-full max-w-md bg-[#FAF6F2] rounded-2xl overflow-hidden flex flex-col"
              style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.5)", maxHeight: "100%" }}
            >
              {/* TOP: dark brown */}
              <div className="px-7 pt-8 pb-6 flex-shrink-0" style={{ background: "#241914" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p style={{ ...mono, color: "#D99A5B" }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                      Now reviewing
                    </p>
                    <h2 style={{ ...mono, color: "#FAF6F2" }} className="text-3xl font-bold tracking-tight leading-snug">
                      {currentUser.firstName} {currentUser.lastName}
                    </h2>
                    {currentUser.skills?.[0] && (
                      <p style={{ ...mono, color: "#C9BDB5" }} className="text-lg mt-1.5">{currentUser.skills[0]}</p>
                    )}
                    {currentUser.age || currentUser.gender ? (
                      <p style={{ ...mono, color: "#9C8A80" }} className="text-sm mt-2">
                        {[currentUser.age && `${currentUser.age} yrs`, currentUser.gender].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>

                  {currentUser.photoUrl ? (
                    <img
                      src={currentUser.photoUrl}
                      alt={currentUser.firstName}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      style={{ border: "2px solid #B5703F" }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#B5703F", border: "2px solid #D99A5B" }}
                    >
                      <span style={{ ...mono, color: "#1A120F" }} className="text-2xl font-bold">{initials}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM: cream */}
              <div className="flex flex-col px-7 py-6 overflow-y-auto">
                <div>
                  <p style={{ ...mono, color: "#6E6A68" }} className="text-xs font-semibold uppercase tracking-wider mb-3">About</p>
                  {currentUser.about ? (
                    <p style={{ ...mono, color: "#4A423D" }} className="text-base leading-relaxed">{currentUser.about}</p>
                  ) : (
                    <p style={{ ...mono, color: "#A89C94" }} className="text-base italic">No bio provided.</p>
                  )}
                </div>

                <div className="mt-6 pt-5 flex-shrink-0" style={{ borderTop: "1px solid #E8DDD3" }}>
                  {/* Mobile progress */}
                  <div className="flex items-center gap-3 mb-5 lg:hidden">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EEE3D8" }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: "#B5703F" }} />
                    </div>
                    <p style={{ ...mono, color: "#9C8A80" }} className="text-xs flex-shrink-0">{currentIndex + 1} / {users.length}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction("ignored", currentUser._id)}
                      disabled={actionLoading}
                      style={{ ...mono, background: "#FAF6F2", border: "1px solid #E8DDD3", color: "#4A423D" }}
                      className="flex-1 font-semibold py-3.5 rounded-xl text-base transition-all disabled:opacity-40 hover:border-[#D3C4B6]"
                    >
                      ✕ Pass
                    </button>
                    <button
                      onClick={() => handleAction("interested", currentUser._id)}
                      disabled={actionLoading}
                      style={{ ...mono, background: "#B5703F", flexGrow: 1.5 }}
                      className="flex-1 text-[#FAF6F2] font-semibold py-3.5 rounded-xl text-base transition-all disabled:opacity-40 hover:opacity-90 active:scale-[0.98]"
                    >
                      ♥ Interested
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: stats ── */}
          <div className="hidden lg:flex flex-col gap-4 w-60 flex-shrink-0">
            <div className="rounded-xl p-5" style={{ background: "#241914", border: "1px solid #3A2A22" }}>
              <p style={{ ...mono, color: "#9C8A80" }} className="text-xs uppercase tracking-wider font-medium mb-4">Feed stats</p>
              <div className="space-y-3">
                <div>
                  <p style={{ ...mono, color: "#D99A5B" }} className="text-2xl font-bold leading-none">{users.length}</p>
                  <p style={{ ...mono, color: "#9C8A80" }} className="text-xs mt-0.5">Total in feed</p>
                </div>
                <div className="pt-3" style={{ borderTop: "1px solid #3A2A22" }}>
                  <p style={{ ...mono, color: "#D99A5B" }} className="text-2xl font-bold leading-none">{currentIndex}</p>
                  <p style={{ ...mono, color: "#9C8A80" }} className="text-xs mt-0.5">Reviewed</p>
                </div>
                <div className="pt-3" style={{ borderTop: "1px solid #3A2A22" }}>
                  <p style={{ ...mono, color: "#D99A5B" }} className="text-2xl font-bold leading-none">{users.length - currentIndex - 1}</p>
                  <p style={{ ...mono, color: "#9C8A80" }} className="text-xs mt-0.5">Remaining</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/connections")}
              style={{ ...mono, background: "#241914", border: "1px solid #3A2A22", color: "#D99A5B" }}
              className="font-semibold py-2.5 rounded-xl text-xs transition-all text-center hover:border-[#4A352B]"
            >
              View Connections →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feed;