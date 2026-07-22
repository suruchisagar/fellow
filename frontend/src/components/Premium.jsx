import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const plans = [
  {
    id: "silver",
    name: "Silver",
    price: 300,
    features: [
      "Unlimited connections",
      "See who viewed your profile",
      "Priority in feed",
      "Basic analytics",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 700,
    popular: true,
    features: [
      "Everything in Silver",
      "Direct message anyone",
      "Featured developer badge",
      "Advanced analytics",
      "Early access to new features",
    ],
  },
];

const Premium = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/premium/verify", { withCredentials: true });
        setUser(res.data);
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (membershipType) => {
    setPayLoading(membershipType);
    try {
      const { data } = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType },
        { withCredentials: true }
      );
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Fellow",
        description: `${membershipType} Membership`,
        order_id: data.orderId,
        prefill: { name: `${user?.firstName} ${user?.lastName}`, email: user?.emailId },
        theme: { color: "#B5703F" },
        handler: async () => {
          const verifyRes = await axios.get(BASE_URL + "/premium/verify", { withCredentials: true });
          setUser(verifyRes.data);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setPayLoading(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ background: "#1A120F" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
          <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ background: "#1A120F" }}>
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <div className="w-full max-w-2xl">

          {/* ── Already Premium ── */}
          {user?.isPremium ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(217,154,91,0.1)", border: "1px solid rgba(217,154,91,0.3)" }}
              >
                <span style={{ color: "#D99A5B" }} className="text-2xl">✦</span>
              </div>
              <div>
                <p style={{ ...mono, color: "#FAF6F2" }} className="font-bold text-xl mb-1 tracking-tight">
                  You're a {user.membershipType} member!
                </p>
                <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Enjoy all your premium benefits.</p>
              </div>
              <div className="rounded-xl px-6 py-3" style={{ background: "#241914", border: "1px solid rgba(217,154,91,0.3)" }}>
                <p style={{ ...mono, color: "#D99A5B" }} className="text-xs font-semibold">
                  ✦ {user.membershipType} membership active
                </p>
              </div>
              <button
                onClick={() => navigate("/feed")}
                style={{ ...mono, background: "#B5703F" }}
                className="text-[#FAF6F2] font-semibold px-8 py-3 rounded-xl text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Back to Feed →
              </button>
            </div>

          ) : (
            <>
              {/* ── Hero ── */}
              <div className="text-center mb-7">
                <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-2">
                  Membership
                </p>
                <h1 style={{ ...mono, color: "#FAF6F2" }} className="text-2xl font-bold tracking-tight mb-1">
                  Upgrade your Fellow
                </h1>
                <p style={{ ...mono, color: "#9C8A80" }} className="text-sm">Connect better. Grow faster. Stand out.</p>
              </div>

              {/* ── Plans ── */}
              <div className="grid grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="relative rounded-2xl p-5 transition-all"
                    style={{
                      background: "#FAF6F2",
                      border: plan.popular ? "1px solid #D99A5B" : "1px solid #E8DDD3",
                      boxShadow: plan.popular ? "0 12px 30px rgba(181,112,63,0.2)" : "0 8px 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span style={{ ...mono, background: "#B5703F", color: "#FAF6F2" }} className="text-xs font-bold px-3 py-0.5 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="mb-4">
                      <h3 style={{ ...mono, color: plan.popular ? "#B5703F" : "#241914" }} className="text-base font-bold">
                        {plan.popular ? "✦ " : "⚡ "}{plan.name}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span style={{ ...mono, color: "#241914" }} className="text-2xl font-bold">₹{plan.price}</span>
                        <span style={{ ...mono, color: "#9C8A80" }} className="text-xs">/month</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px mb-4" style={{ background: "#E8DDD3" }} />

                    {/* Features */}
                    <ul className="space-y-2.5 mb-5">
                      {plan.features.map((f, i) => (
                        <li key={i} style={{ ...mono, color: "#4A423D" }} className="flex items-start gap-2.5 text-xs">
                          <span style={{ color: "#B5703F" }} className="flex-shrink-0 font-bold">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => handlePayment(plan.id)}
                      disabled={payLoading !== null}
                      style={
                        plan.popular
                          ? { ...mono, background: "#B5703F", color: "#FAF6F2" }
                          : { ...mono, background: "#241914", color: "#FAF6F2" }
                      }
                      className="w-full font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
                    >
                      {payLoading === plan.id ? "Processing..." : `Get ${plan.name} →`}
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <p style={{ ...mono, color: "#6E6A68" }} className="text-center text-xs mt-5">
                Secured by Razorpay · Cancel anytime · No hidden charges
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Premium;