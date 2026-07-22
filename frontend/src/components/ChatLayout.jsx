import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}`;


const mono = { fontFamily: "'JetBrains Mono', monospace" };

const ChatLayout = () => {
  const { userId: targetUserId } = useParams();
  const navigate = useNavigate();

  // ── Connections list state (from Connections.jsx) ──
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);

  // ── Chat state (from Chat.jsx) ──
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  // ── Load connections list (always) ──
  const getConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      setConnections(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setConnectionsLoading(false);
    }
  };

  useEffect(() => { getConnections(); }, []);

  // ── Load chat + socket when a targetUserId is present ──
  useEffect(() => {
    if (!targetUserId) {
      setMessages([]);
      setTargetUser(null);
      socketRef.current?.disconnect();
      return;
    }

    let cancelled = false;
    setChatLoading(true);

    const init = async () => {
      try {
        const [userRes, chatRes, connectionsRes] = await Promise.all([
          axios.get(BASE_URL + "/profile/view", { withCredentials: true }),
          axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true }),
          axios.get(BASE_URL + "/user/connections", { withCredentials: true }),
        ]);

        if (cancelled) return;

        const user = userRes.data;
        const chat = chatRes.data;
        const conns = connectionsRes.data.data || [];

        setCurrentUser(user);

        const found = conns.find(
          (c) => c._id?.toString() === targetUserId?.toString()
        );
        if (found) setTargetUser(found);

        const msgs = chat.messages.map((m) => ({
          senderId: m.senderId._id || m.senderId,
          firstName: m.senderId.firstName || "",
          lastName: m.senderId.lastName || "",
          text: m.text,
          createdAt: m.createdAt,
        }));
        setMessages(msgs);

        if (!found) {
          const otherMsg = msgs.find(
            (m) => m.senderId?.toString() !== user._id?.toString()
          );
          if (otherMsg) {
            setTargetUser({ firstName: otherMsg.firstName, lastName: otherMsg.lastName });
          }
        }

        const socket = io(SOCKET_URL, { withCredentials: true, transports: ["websocket"] });
        socketRef.current = socket;

        socket.emit("joinChat", { firstName: user.firstName, userId: user._id, targetUserId });

        socket.on("messageReceived", ({ firstName, lastName, text, senderId }) => {
          setTargetUser((prev) =>
            prev ?? (senderId?.toString() !== user._id?.toString() ? { firstName, lastName } : prev)
          );
          setMessages((prev) => [...prev, { senderId, firstName, lastName, text, createdAt: new Date() }]);
        });

        if (!cancelled) setChatLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) setChatLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
    };
  }, [targetUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !currentUser || !socketRef.current) return;
    socketRef.current.emit("sendMessage", {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      userId: currentUser._id,
      targetUserId,
      text: text.trim(),
    });
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const targetName = targetUser
    ? `${targetUser.firstName ?? ""} ${targetUser.lastName ?? ""}`.trim()
    : "";
  const targetInitials = targetUser
    ? `${targetUser.firstName?.[0] ?? ""}${targetUser.lastName?.[0] ?? ""}`
    : "?";

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden" style={{ background: "#1A120F" }}>
      <Navbar />

      <div className="flex-1 flex min-h-0 px-4 pb-4 pt-[4.5rem] gap-4 overflow-hidden">

        {/* ══════════ LEFT: Connections list ══════════ */}
        <div
          className="w-full max-w-xs flex-shrink-0 flex flex-col rounded-2xl overflow-hidden"
          style={{ background: "#FAF6F2", border: "1px solid #3A2A22" }}
        >
          <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #E8DDD3" }}>
            <p style={{ ...mono, color: "#B5703F" }} className="text-xs font-semibold uppercase tracking-widest mb-1">
              Your network
            </p>
            <div className="flex items-end justify-between">
              <h1 style={{ ...mono, color: "#241914" }} className="text-xl font-bold tracking-tight">
                Connections
              </h1>
              {connections.length > 0 && (
                <span style={{ ...mono, color: "#9C8A80" }} className="text-xs mb-0.5">
                  {connections.length} connection{connections.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            {connectionsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : connections.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#F2E9E4" }}>
                  <span style={{ color: "#B5703F" }} className="text-xl">⊘</span>
                </div>
                <div>
                  <p style={{ ...mono, color: "#241914" }} className="font-bold text-sm mb-1">No connections yet</p>
                  <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Go explore developers on the feed!</p>
                </div>
                <button
                  onClick={() => navigate("/feed")}
                  style={{ ...mono, background: "#B5703F" }}
                  className="text-[#FAF6F2] font-semibold px-4 py-2 rounded-xl text-xs transition-all hover:opacity-90"
                >
                  Back to Feed →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {connections.map((user) => {
                  const isSelected = user._id?.toString() === targetUserId?.toString();
                  return (
                    <button
                      key={user._id}
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="text-left rounded-xl p-3 flex items-center gap-3 transition-all duration-150"
                      style={{
                        background: isSelected ? "#F0DCC4" : "transparent",
                        border: isSelected ? "1px solid #B5703F" : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#F2E9E4"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: "#B5703F" }}
                      >
                        {user.photoUrl ? (
                          <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <span style={{ ...mono, color: "#FAF6F2" }} className="font-bold text-xs">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 style={{ ...mono, color: "#241914" }} className="font-semibold text-sm truncate">
                          {user.firstName} {user.lastName}
                        </h2>
                        {user.skills?.[0] && (
                          <p style={{ ...mono, color: "#9C8A80" }} className="text-xs truncate">{user.skills[0]}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══════════ RIGHT: Chat panel ══════════ */}
        <div
          className="flex-1 flex flex-col rounded-2xl overflow-hidden min-w-0"
          style={{ background: "#FAF6F2", border: "1px solid #3A2A22" }}
        >
          {!targetUserId ? (
            // ── No conversation selected ──
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#F2E9E4" }}>
                <span style={{ color: "#B5703F" }} className="text-2xl">💬</span>
              </div>
              <div className="text-center">
                <p style={{ ...mono, color: "#241914" }} className="text-sm font-semibold mb-1">Select a conversation</p>
                <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Choose someone from your connections to start chatting.</p>
              </div>
            </div>
          ) : chatLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-2 border-[#B5703F] border-t-transparent rounded-full animate-spin" />
                <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-6 py-4 flex items-center gap-3 flex-shrink-0" style={{ borderBottom: "1px solid #E8DDD3" }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ background: "#B5703F" }}
                >
                  {targetUser?.photoUrl ? (
                    <img src={targetUser.photoUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span style={{ ...mono, color: "#FAF6F2" }} className="text-sm font-bold">{targetInitials}</span>
                  )}
                </div>
                <div>
                  <p style={{ ...mono, color: "#241914" }} className="font-semibold text-base leading-none">
                    {targetName || "—"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#7FA86B" }} />
                    <p style={{ ...mono, color: "#7FA86B" }} className="text-xs">Online</p>
                  </div>
                </div>
                <button className="ml-auto" style={{ color: "#9C8A80" }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-2 min-h-0">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#F2E9E4" }}>
                      <span style={{ color: "#B5703F" }} className="text-xl">💬</span>
                    </div>
                    <div className="text-center">
                      <p style={{ ...mono, color: "#241914" }} className="text-sm font-semibold mb-1">No messages yet</p>
                      <p style={{ ...mono, color: "#9C8A80" }} className="text-xs">
                        {targetName ? `Say hello to ${targetName}!` : "Start the conversation!"}
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => {
                  const isMe = msg.senderId?.toString() === currentUser?._id?.toString();
                  const isLastInGroup = i === messages.length - 1 || messages[i + 1]?.senderId?.toString() !== msg.senderId?.toString();
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        className="max-w-[70%] px-4 py-2.5 text-sm leading-relaxed break-words"
                        style={
                          isMe
                            ? { ...mono, background: "#B5703F", color: "#FAF6F2", borderRadius: "16px 16px 4px 16px" }
                            : { ...mono, background: "#F2E9E4", color: "#4A423D", borderRadius: "16px 16px 16px 4px" }
                        }
                      >
                        {msg.text}
                      </div>
                      {isLastInGroup && (
                        <span style={{ ...mono, color: "#A89C94" }} className="text-xs mt-1 mx-1">
                          {formatTime(msg.createdAt)} {isMe ? "✓✓" : ""}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #E8DDD3" }}>
                <div className="flex items-center gap-3">
                  <button style={{ color: "#9C8A80" }} className="flex-shrink-0 hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    style={{ ...mono, background: "#F2E9E4", color: "#241914" }}
                    className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-colors min-w-0 placeholder-[#A89C94]"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim()}
                    style={{ background: "#B5703F" }}
                    className="text-[#FAF6F2] w-11 h-11 rounded-full flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatLayout;