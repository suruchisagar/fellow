import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
  "C++", "Go", "Rust", "MongoDB", "PostgreSQL", "MySQL", "Redis",
  "Docker", "Kubernetes", "AWS", "GraphQL", "Next.js", "Vue", "Angular"
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", age: "", gender: "",
    about: "", photoUrl: "", skills: [],
  });

  const fetchProfile = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", { withCredentials: true });
      setUser(res.data);
      setForm({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        age: res.data.age || "",
        gender: res.data.gender || "",
        about: res.data.about || "",
        photoUrl: res.data.photoUrl || "",
        skills: res.data.skills || [],
      });
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit", form, { withCredentials: true });
      setUser(res.data.data);
      setSuccess(true); setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : prev.skills.length < 10 ? [...prev.skills, skill] : prev.skills,
    }));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: "#1A120F" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-colors";
  const inputStyle = { ...mono, background: "#FAF6F2", border: "1px solid #E8DDD3", color: "#241914" };
  const labelClass = "block text-xs font-semibold uppercase tracking-widest mb-1.5";
  const labelStyle = { ...mono, color: "#B5703F" };

  const navItems = [
    { id: "profile", label: "Profile" },
    { id: "skills", label: "Skills" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ background: "#1A120F" }}>
      <Navbar />

      <div className="flex-1 flex min-h-0 pt-14">

        {/* ── Sidebar ── */}
        <div className="w-64 flex-shrink-0 flex flex-col h-full overflow-hidden" style={{ background: "#241914", borderRight: "1px solid #3A2A22" }}>

          {/* Avatar + name block */}
          <div className="flex flex-col items-center px-6 pt-8 pb-6 flex-shrink-0" style={{ borderBottom: "1px solid #3A2A22" }}>
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center mb-4 flex-shrink-0"
              style={{ background: "#3A2A22", border: "2px solid #B5703F" }}
            >
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <span style={{ ...mono, color: "#D99A5B" }} className="text-2xl font-bold">{initials}</span>
              )}
            </div>
            <p style={{ ...mono, color: "#FAF6F2" }} className="font-bold text-sm text-center tracking-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p style={{ ...mono, color: "#D99A5B" }} className="text-xs text-center mt-0.5 truncate w-full px-2">
              {user?.skills?.[0] || user?.emailId}
            </p>

            {/* Skills preview */}
            {user?.skills?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mt-3">
                {user.skills.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    style={{ ...mono, background: "rgba(181,112,63,0.15)", border: "1px solid rgba(181,112,63,0.3)", color: "#D99A5B" }}
                    className="text-xs px-2 py-0.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
                {user.skills.length > 3 && (
                  <span style={{ ...mono, color: "#9C8A80" }} className="text-xs px-2 py-0.5">+{user.skills.length - 3}</span>
                )}
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1 px-3 py-4 flex-shrink-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setEditing(false); setError(""); }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={
                  activeTab === item.id
                    ? { ...mono, background: "#B5703F", color: "#FAF6F2" }
                    : { ...mono, color: "#9C8A80" }
                }
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.background = "#2E2117";
                    e.currentTarget.style.color = "#C9BDB5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#9C8A80";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1 min-h-0" />

          {/* Bottom: Premium */}
          <div className="px-3 py-4 flex flex-col gap-2 flex-shrink-0" style={{ borderTop: "1px solid #3A2A22" }}>
            {!user?.isPremium && (
              <a
                href="/premium"
                style={{ ...mono, background: "rgba(217,154,91,0.08)", border: "1px solid rgba(217,154,91,0.25)", color: "#D99A5B" }}
                className="flex items-center justify-center gap-2 font-semibold py-2.5 rounded-xl text-xs transition-all hover:opacity-80"
              >
                ✦ Upgrade to Premium
              </a>
            )}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ background: "#1A120F" }}>

          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5 flex-shrink-0" style={{ borderBottom: "1px solid #3A2A22" }}>
            <div>
              <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-0.5">
                {navItems.find(n => n.id === activeTab)?.label}
              </p>
              <h1 style={{ ...mono, color: "#FAF6F2" }} className="text-lg font-bold tracking-tight">
                {activeTab === "profile" && "Personal information"}
                {activeTab === "skills" && "Your tech stack"}
                {activeTab === "settings" && "Account settings"}
              </h1>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{ ...mono, background: "#241914", border: "1px solid #3A2A22", color: "#D99A5B" }}
                  className="font-semibold py-2 px-4 rounded-xl text-xs transition-all hover:border-[#4A352B]"
                >
                  ✎ Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setError(""); }}
                    style={{ ...mono, background: "#241914", border: "1px solid #3A2A22", color: "#9C8A80" }}
                    className="font-semibold py-2 px-4 rounded-xl text-xs transition-all hover:border-[#4A352B]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ ...mono, background: "#B5703F" }}
                    className="text-[#FAF6F2] font-semibold py-2 px-5 rounded-xl text-xs transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          {(success || error) && (
            <div className="px-8 pt-4 flex-shrink-0">
              {success && (
                <div
                  style={{ ...mono, background: "rgba(181,112,63,0.1)", border: "1px solid rgba(181,112,63,0.3)", color: "#D99A5B" }}
                  className="text-xs px-4 py-2.5 rounded-xl text-center"
                >
                  ✓ Profile updated successfully!
                </div>
              )}
              {error && (
                <div
                  style={{ ...mono, background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)", color: "#f87171" }}
                  className="text-xs px-4 py-2.5 rounded-xl text-center"
                >
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Scrollable form area — cream panel */}
          <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
            <div className="rounded-2xl p-7" style={{ background: "#FAF6F2" }}>

              {/* ── Profile tab ── */}
              {activeTab === "profile" && (
                <div className="flex flex-col gap-6 max-w-lg">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass} style={labelStyle}>First name</label>
                      {editing
                        ? <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} style={inputStyle} />
                        : <p style={{ ...mono, color: "#241914" }} className="text-sm py-2 font-medium">{user?.firstName || "—"}</p>}
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Last name</label>
                      {editing
                        ? <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} style={inputStyle} />
                        : <p style={{ ...mono, color: "#241914" }} className="text-sm py-2 font-medium">{user?.lastName || "—"}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4" style={{ borderTop: "1px solid #E8DDD3" }}>
                    <div>
                      <label className={labelClass} style={labelStyle}>Age</label>
                      {editing
                        ? <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className={inputClass} style={inputStyle} />
                        : <p style={{ ...mono, color: "#4A423D" }} className="text-sm py-2">{user?.age || "—"}</p>}
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Gender</label>
                      {editing ? (
                        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass} style={inputStyle}>
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      ) : <p style={{ ...mono, color: "#4A423D" }} className="text-sm py-2 capitalize">{user?.gender || "—"}</p>}
                    </div>
                  </div>

                  <div className="pt-4" style={{ borderTop: "1px solid #E8DDD3" }}>
                    <label className={labelClass} style={labelStyle}>Photo URL</label>
                    {editing
                      ? <input value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." className={inputClass} style={inputStyle} />
                      : <p style={{ ...mono, color: "#4A423D" }} className="text-sm py-2 truncate">{user?.photoUrl || "—"}</p>}
                  </div>

                  <div className="pt-4" style={{ borderTop: "1px solid #E8DDD3" }}>
                    <label className={labelClass} style={labelStyle}>About</label>
                    {editing
                      ? <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={4} className={inputClass + " resize-none"} style={inputStyle} />
                      : <p style={{ ...mono, color: "#4A423D" }} className="text-sm py-2 leading-relaxed">{user?.about || "—"}</p>}
                  </div>
                </div>
              )}

              {/* ── Skills tab ── */}
              {activeTab === "skills" && (
                <div className="flex flex-col gap-5">
                  {!editing ? (
                    <>
                      <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Your current tech stack. Click Edit to update.</p>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                          <span
                            key={i}
                            style={{ ...mono, background: "rgba(181,112,63,0.1)", border: "1px solid rgba(181,112,63,0.25)", color: "#B5703F" }}
                            className="text-sm px-3 py-1.5 rounded-xl font-medium"
                          >
                            {skill}
                          </span>
                        )) : (
                          <p style={{ ...mono, color: "#A89C94" }} className="text-sm">No skills added yet. Click Edit to add skills.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Select up to 10 skills from the list below.</p>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS_OPTIONS.map((skill) => {
                          const selected = form.skills.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className="text-sm px-3 py-1.5 rounded-xl transition-all"
                              style={
                                selected
                                  ? { ...mono, background: "#B5703F", border: "1px solid #B5703F", color: "#FAF6F2", fontWeight: 600 }
                                  : { ...mono, background: "#FFFFFF", border: "1px solid #E8DDD3", color: "#6E6A68" }
                              }
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                      <p style={{ ...mono, color: "#A89C94" }} className="text-xs">{form.skills.length} / 10 selected</p>
                    </>
                  )}
                </div>
              )}

              {/* ── Settings tab ── */}
              {activeTab === "settings" && (
                <div className="flex flex-col gap-4 max-w-lg">
                  <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E8DDD3" }}>
                    <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-1">Email address</p>
                    <p style={{ ...mono, color: "#4A423D" }} className="text-sm">{user?.emailId}</p>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: "#FFFFFF", border: "1px solid #E8DDD3" }}>
                    <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-1">Account type</p>
                    <p style={{ ...mono, color: "#4A423D" }} className="text-sm">{user?.isPremium ? "Premium member" : "Free plan"}</p>
                  </div>
                  {!user?.isPremium && (
                    <a
                      href="/premium"
                      style={{ ...mono, background: "rgba(217,154,91,0.08)", border: "1px solid rgba(217,154,91,0.3)", color: "#B5703F" }}
                      className="flex items-center justify-center gap-2 font-semibold py-3 rounded-xl text-sm transition-all hover:opacity-80"
                    >
                      ✦ Upgrade to Premium
                    </a>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;