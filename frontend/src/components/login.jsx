import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = "/api";

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const FellowLogo = () => (
  <div className="w-9 h-9 bg-[#B5703F] rounded-xl flex items-center justify-center flex-shrink-0">
    <div className="w-3 h-3 bg-[#FAF6F2] rounded-full" />
  </div>
);

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(BASE_URL + "/login", { emailId, password }, { withCredentials: true });
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col h-full overflow-hidden relative" style={{ background: "#1A120F" }}>

        {/* Background circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(181,112,63,0.06)" }} />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "rgba(181,112,63,0.1)" }} />

        {/* Logo row */}
        <div className="flex items-center gap-3 px-10 pt-8 pb-0 relative z-10 flex-shrink-0">
          <FellowLogo />
          <span style={{ ...mono, color: "#FAF6F2" }} className="text-lg font-bold tracking-tight">Fellow</span>
        </div>

        {/* Active badge */}
        <div className="px-10 pt-4 flex-shrink-0 relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: "rgba(181,112,63,0.12)", border: "1px solid rgba(181,112,63,0.25)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D99A5B" }} />
            <span style={{ ...mono, color: "#D99A5B" }} className="text-xs font-medium">12,000+ developers active</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-10 py-4 relative z-10 min-h-0">
          <h1 style={{ ...mono, color: "#FAF6F2" }} className="text-4xl font-bold leading-[1.2] tracking-tight mb-3">
            Grow your<br />dev network.<br />
            <span style={{ color: "#D99A5B" }}>Ship together.</span>
          </h1>
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm leading-relaxed max-w-sm mb-6">
            Connect with engineers building the future. Get code reviews, find co-founders, and land your next role.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Code reviews", "Open source collabs", "Job referrals", "Hackathons", "Mentorship"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full px-3 py-1"
                style={{ background: "#241914", border: "1px solid rgba(181,112,63,0.3)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#B5703F" }} />
                <span style={{ ...mono, color: "#C9913F" }} className="text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-xl p-4 max-w-sm" style={{ background: "#241914", border: "1px solid #3A2A22" }}>
            <p style={{ ...mono, color: "#9C8A80" }} className="text-xs italic leading-relaxed mb-3">
              "Found my co-founder through Fellow. We shipped our product in 3 months."
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ ...mono, background: "#B5703F", color: "#FAF6F2" }}
              >
                PK
              </div>
              <div>
                <p style={{ ...mono, color: "#C9BDB5" }} className="text-xs font-semibold">Priya K.</p>
                <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Full-stack developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-6 px-10 py-5 flex-shrink-0 relative z-10" style={{ borderTop: "1px solid #3A2A22" }}>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">© 2026 Fellow</p>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Privacy</p>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Terms</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: "#FAF6F2" }}>

        {/* Top bar */}
        <div className="flex items-center justify-between px-10 py-6 flex-shrink-0">
          <div className="flex items-center gap-2.5 lg:hidden">
            <FellowLogo />
            <span style={{ ...mono, color: "#241914" }} className="font-bold">Fellow</span>
          </div>
          <div className="hidden lg:block" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">
            No account?{" "}
            <Link to="/signup" style={{ color: "#B5703F" }} className="font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center px-6 min-h-0">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 style={{ ...mono, color: "#241914" }} className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
              <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Sign in to your Fellow account</p>
            </div>

            <div className="space-y-5">
              <div>
                <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold mb-2 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  style={{ ...mono, background: "#FFFFFF", border: "1px solid #E8DDD3", color: "#241914" }}
                  className="w-full rounded-xl px-4 py-3.5 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                  onFocus={(e) => { e.target.style.borderColor = "#B5703F"; e.target.style.boxShadow = "0 0 0 3px rgba(181,112,63,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E8DDD3"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold uppercase tracking-wider">
                    Password
                  </label>
                  <span style={{ ...mono, color: "#B5703F" }} className="text-xs font-medium cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{ ...mono, background: "#FFFFFF", border: "1px solid #E8DDD3", color: "#241914" }}
                  className="w-full rounded-xl px-4 py-3.5 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                  onFocus={(e) => { e.target.style.borderColor = "#B5703F"; e.target.style.boxShadow = "0 0 0 3px rgba(181,112,63,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#E8DDD3"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <p style={{ ...mono, color: "#dc2626" }} className="text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                style={{ ...mono, background: "#B5703F" }}
                className="w-full text-[#FAF6F2] font-semibold py-3.5 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Sign in →
              </button>
            </div>

            <p style={{ ...mono, color: "#9C8A80" }} className="text-center text-sm mt-6 lg:hidden">
              No account?{" "}
              <Link to="/signup" style={{ color: "#B5703F" }} className="font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-10 py-5 flex items-center justify-between flex-shrink-0">
          <p style={{ ...mono, color: "#A89C94" }} className="text-xs">Secure login · 256-bit encryption</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#7FA86B" }} />
            <p style={{ ...mono, color: "#A89C94" }} className="text-xs">All systems operational</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;