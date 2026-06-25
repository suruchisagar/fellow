import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mono = { fontFamily: "var(--font-mono, monospace)" };

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/", { replace: true });
  }, []);

  const handleJoin = () => {
    if (!email) return;
    navigate(`/signup?email=${encodeURIComponent(email)}`);
  };

  return (
    <div style={{ background: "#FAF5ED" }}>

      {/* Nav */}
      <div className="flex justify-between items-center px-6 md:px-16 py-6">
        <div className="flex items-center gap-3">
          {/* <div className="w-9 h-9 rounded-xl bg-[#4A2E1F] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#FAF5ED]" />
          </div> */}
          <span style={mono} className="text-[#4A2E1F] text-lg font-bold">Fellow</span>
        </div>
        <div className="flex items-center gap-5">
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            style={mono}
            className="text-sm hidden md:block text-[#5A4A3A] hover:text-[#1C1A1B] transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => navigate("/login")}
            style={mono}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[#4A2E1F] hover:bg-[#3D2817] text-white transition-all"
          >
            Sign in
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 text-center pt-12 pb-20">
        <div style={mono} className="inline-flex items-center gap-2 bg-[#F0E4D3] border border-[#E0D4C3] text-[#8A6234] text-xs px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4A2E1F]" />
          12,000+ developers active
        </div>

        <h1 style={mono} className="text-4xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight text-[#1C1A1B]">
          Find developers who build like you do.
        </h1>
        <p className="text-[#8A7A68] text-sm md:text-base max-w-md mx-auto mt-5 leading-relaxed">
          Connect with peers by stack, swap code reviews, and build alongside people who get it.
        </p>

        <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto mt-8">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl outline-none text-sm bg-white border border-[#E0D4C3] text-[#1C1A1B] placeholder-[#B5A893] focus:border-[#4A2E1F] transition-all"
          />
          <button
            onClick={handleJoin}
            style={mono}
            className="px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap bg-[#4A2E1F] hover:bg-[#3D2817] text-white transition-all"
          >
            Join Fellow →
          </button>
        </div>

        <div className="flex justify-center mt-10">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold -mr-2 border-2 bg-[#E8C9CE] text-[#6B2737]" style={{ borderColor: "#FAF5ED" }}>AR</div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold -mr-2 border-2 bg-[#C9D6E8] text-[#2A4A6B]" style={{ borderColor: "#FAF5ED" }}>PN</div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-[#D6E8C9] text-[#3A5C2A]" style={{ borderColor: "#FAF5ED" }}>KJ</div>
        </div>
        <p className="text-xs mt-2 text-[#A8967F]">Joined by 2,000+ developers this month</p>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 md:px-20 py-16">
        <p style={mono} className="text-xs tracking-widest uppercase text-center mb-2 text-[#8A7A68]">How it works</p>
        <h2 style={mono} className="text-2xl font-bold text-center mb-12 text-[#1C1A1B]">
          Three steps to your next collaborator
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
          {[
            { n: 1, title: "Build your profile", desc: "Add your stack, projects, and what you're looking to build next." },
            { n: 2, title: "Discover by stack", desc: "Browse developers filtered by language, framework, or interest." },
            { n: 3, title: "Connect and build", desc: "Message, pair up, and ship something together." },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div
                className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-base bg-[#4A2E1F] text-white"
                style={mono}
              >
                {step.n}
              </div>
              <p className="text-sm font-bold mb-1 text-[#1C1A1B]">{step.title}</p>
              <p className="text-xs leading-relaxed text-[#8A7A68]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-6 py-12" style={{ borderTop: "1px solid #E0D4C3" }}>
        <div className="max-w-lg mx-auto bg-white border border-[#E0D4C3] rounded-2xl p-6 text-center">
          <p className="text-base md:text-lg leading-relaxed text-[#1C1A1B] mb-4">
            "Found my co-founder through Fellow. We shipped our product in 3 months."
          </p>
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A2E1F] flex items-center justify-center">
              <span style={mono} className="text-white text-[11px] font-bold">PK</span>
            </div>
            <div className="text-left">
              <p style={mono} className="text-xs font-bold text-[#1C1A1B]">Sagar S.</p>
              <p className="text-xs text-[#8A7A68]">Full-stack developer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-20 py-12" style={{ borderTop: "1px solid #E0D4C3" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <span style={mono} className="text-lg font-bold block mb-2 text-[#1C1A1B]">
              Fellow
            </span>
            <p className="text-xs text-[#8A7A68]">Where developers find their people.</p>
          </div>
          <div>
            <p style={mono} className="font-bold mb-2 text-xs text-[#1C1A1B]">Product</p>
            <p className="text-xs mb-1 text-[#8A7A68]">Discover</p>
            <p className="text-xs mb-1 text-[#8A7A68]">Messaging</p>
            <p className="text-xs text-[#8A7A68]">Profiles</p>
          </div>
          <div>
            <p style={mono} className="font-bold mb-2 text-xs text-[#1C1A1B]">Company</p>
            <p className="text-xs mb-1 text-[#8A7A68]">About</p>
            <p className="text-xs mb-1 text-[#8A7A68]">Careers</p>
            <p className="text-xs text-[#8A7A68]">Contact</p>
          </div>
          <div>
            <p style={mono} className="font-bold mb-2 text-xs text-[#1C1A1B]">Legal</p>
            <p className="text-xs mb-1 text-[#8A7A68]">Privacy</p>
            <p className="text-xs text-[#8A7A68]">Terms</p>
          </div>
        </div>
        <p style={mono} className="text-xs text-[#A8967F] mt-10">© 2026 Fellow</p>
      </footer>
    </div>
  );
}