import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = "/api";

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const FellowLogo = () => (
  <div className="w-8 h-8 bg-[#B5703F] rounded-xl flex items-center justify-center flex-shrink-0">
    <div className="w-2.5 h-2.5 bg-[#FAF6F2] rounded-full" />
  </div>
);

const links = [
  { path: "/feed", label: "Feed" },
  { path: "/connections", label: "Connections" },
  { path: "/requests", label: "Requests" },
  { path: "/profile", label: "Profile" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "#1A120F", borderBottom: "1px solid #3A2A22" }}
    >
      <div className="w-full px-6 h-14 flex items-center justify-between">

        {/* LEFT — Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <FellowLogo />
          <span style={{ ...mono, color: "#FAF6F2" }} className="font-bold text-sm tracking-tight">
            Fellow
          </span>
        </a>

        {/* CENTER — Nav Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                isActive(link.path)
                  ? { ...mono, background: "rgba(181,112,63,0.12)", color: "#D99A5B", border: "1px solid rgba(181,112,63,0.3)" }
                  : { ...mono, color: "#9C8A80", border: "1px solid transparent" }
              }
              onMouseEnter={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.color = "#C9BDB5";
                  e.currentTarget.style.background = "#241914";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.path)) {
                  e.currentTarget.style.color = "#9C8A80";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* RIGHT — Logout */}
        <button
          onClick={handleLogout}
          style={{ ...mono, color: "#9C8A80" }}
          className="text-xs font-semibold transition-colors hover:text-red-400"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;