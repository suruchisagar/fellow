import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const FellowLogo = () => (
  <div className="w-8 h-8 bg-[#B5703F] rounded-xl flex items-center justify-center flex-shrink-0">
    <div className="w-2.5 h-2.5 bg-[#FAF6F2] rounded-full" />
  </div>
);

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(BASE_URL + "/signup", { firstName, lastName, emailId, password }, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data || "Signup failed. Try again.");
    }
  };

  const inputStyle = { ...mono, background: "#FFFFFF", border: "1px solid #E8DDD3", color: "#241914" };
  const onFocusStyle = (e) => { e.target.style.borderColor = "#B5703F"; e.target.style.boxShadow = "0 0 0 3px rgba(181,112,63,0.12)"; };
  const onBlurStyle = (e) => { e.target.style.borderColor = "#E8DDD3"; e.target.style.boxShadow = "none"; };

  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col h-screen overflow-hidden relative" style={{ background: "#1A120F" }}>

        {/* bg blob */}
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"
          style={{ background: "rgba(181,112,63,0.1)" }}
        />

        {/* TOP: logo + badge */}
        <div className="flex-shrink-0 px-10 pt-7 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <FellowLogo />
            <span style={{ ...mono, color: "#FAF6F2" }} className="text-base font-bold tracking-tight">Fellow</span>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1"
            style={{ background: "rgba(181,112,63,0.12)", border: "1px solid rgba(181,112,63,0.25)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#D99A5B" }} />
            <span style={{ ...mono, color: "#D99A5B" }} className="text-xs font-medium">Join 12,000+ developers</span>
          </div>
        </div>

        {/* MIDDLE: main content */}
        <div className="flex-1 flex flex-col justify-center px-10 relative z-10 min-h-0 py-4">
          <h1 style={{ ...mono, color: "#FAF6F2" }} className="text-3xl font-bold leading-snug tracking-tight mb-2">
            Start building.<br />
            Start connecting.<br />
            <span style={{ color: "#D99A5B" }}>Start shipping.</span>
          </h1>

          <p style={{ ...mono, color: "#9C8A80" }} className="text-xs leading-relaxed max-w-xs mb-5">
            Join the developer community where code gets reviewed, ideas turn into products, and careers take off.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-5">
            {[{ value: "12K+", label: "Developers" }, { value: "3.4K+", label: "Projects" }, { value: "840+", label: "Collabs" }].map((s) => (
              <div key={s.label}>
                <p style={{ ...mono, color: "#D99A5B" }} className="text-base font-bold leading-none mb-0.5">{s.value}</p>
                <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-2.5 mb-5">
            {[{ step: "01", text: "Create your free account" }, { step: "02", text: "Set up your dev profile" }, { step: "03", text: "Connect & collaborate" }].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: "#241914", border: "1px solid rgba(181,112,63,0.3)" }}
                >
                  <span style={{ ...mono, color: "#D99A5B" }} className="text-xs font-bold">{item.step}</span>
                </div>
                <span style={{ ...mono, color: "#C9913F" }} className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-xl p-4 max-w-xs" style={{ background: "#241914", border: "1px solid #3A2A22" }}>
            <p style={{ ...mono, color: "#9C8A80" }} className="text-xs italic leading-relaxed mb-2.5">
              "Fellow helped me land my first open-source contribution within a week of joining."
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ ...mono, background: "#B5703F", color: "#FAF6F2" }}
              >
                AR
              </div>
              <div>
                <p style={{ ...mono, color: "#C9BDB5" }} className="text-xs font-semibold">Arjun R.</p>
                <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Backend engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: footer */}
        <div className="flex-shrink-0 flex items-center gap-5 px-10 py-4 relative z-10" style={{ borderTop: "1px solid #3A2A22" }}>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">© 2026 Fellow</p>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Privacy</p>
          <p style={{ ...mono, color: "#6E6A68" }} className="text-xs">Terms</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: "#FAF6F2" }}>

        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-10 py-5">
          <div className="flex items-center gap-2.5 lg:hidden">
            <FellowLogo />
            <span style={{ ...mono, color: "#241914" }} className="font-bold">Fellow</span>
          </div>
          <div className="hidden lg:block" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#B5703F" }} className="font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-6 min-h-0 overflow-y-auto">
          <div className="w-full max-w-md py-2">

            <div className="mb-6">
              <h2 style={{ ...mono, color: "#241914" }} className="text-2xl font-bold tracking-tight mb-1.5">Create account</h2>
              <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Join Fellow for free today.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    First name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={inputStyle}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                    Last name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={inputStyle}
                    onFocus={onFocusStyle}
                    onBlur={onBlurStyle}
                    className="w-full rounded-xl px-4 py-3 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  className="w-full rounded-xl px-4 py-3 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <label style={{ ...mono, color: "#6E6A68" }} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  style={inputStyle}
                  onFocus={onFocusStyle}
                  onBlur={onBlurStyle}
                  className="w-full rounded-xl px-4 py-3 text-sm placeholder-[#C9BDB5] focus:outline-none transition-all shadow-sm"
                />
              </div>

              {error && (
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                  <p style={{ ...mono, color: "#dc2626" }} className="text-xs">{error}</p>
                </div>
              )}

              <button
                onClick={handleSignup}
                style={{ ...mono, background: "#B5703F" }}
                className="w-full text-[#FAF6F2] font-semibold py-3 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Create Account →
              </button>

              <p style={{ ...mono, color: "#A89C94" }} className="text-center text-xs">
                By signing up you agree to our{" "}
                <span style={{ color: "#B5703F" }} className="cursor-pointer hover:underline">Terms</span>{" "}and{" "}
                <span style={{ color: "#B5703F" }} className="cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>

            <p style={{ ...mono, color: "#9C8A80" }} className="text-center text-sm mt-5 lg:hidden">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#B5703F" }} className="font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex-shrink-0 px-10 py-4 flex items-center justify-between">
          <p style={{ ...mono, color: "#A89C94" }} className="text-xs">Secure signup · 256-bit encryption</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#7FA86B" }} />
            <p style={{ ...mono, color: "#A89C94" }} className="text-xs">All systems operational</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;