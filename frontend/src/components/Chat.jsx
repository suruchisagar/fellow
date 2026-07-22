import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const BASE_URL = `${SOCKET_URL}/api`;


const Chat = () => {
  const { userId: targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch current user, chat history, and connections list in parallel
        const [userRes, chatRes, connectionsRes] = await Promise.all([
          axios.get(BASE_URL + "/profile/view", { withCredentials: true }),
          axios.get(`${BASE_URL}/chat/${targetUserId}`, { withCredentials: true }),
          axios.get(BASE_URL + "/user/connections", { withCredentials: true }),
        ]);

        const user = userRes.data;
        const chat = chatRes.data;
        const connections = connectionsRes.data.data || [];

        setCurrentUser(user);

        // Find target user from connections list using targetUserId
        const found = connections.find(
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

        // Fallback: extract from messages if not in connections
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

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    init();
    return () => { socketRef.current?.disconnect(); };
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
  const myInitials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`
    : "";

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0a1628] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1D9E75] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#2a5a6e] text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0a1628] flex overflow-hidden">

      {/* ── Sidebar ── */}
      <div className="hidden lg:flex w-60 flex-shrink-0 bg-[#0d1b2a] border-r border-[#1a3a4a] flex-col h-full overflow-hidden">

        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-[#1a3a4a] flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 bg-[#0f6e56] rounded-lg flex items-center justify-center flex-shrink-0">
              <div className="w-2.5 h-2.5 bg-[#5DCAA5] rounded-full" />
            </div>
            <span className="text-[#e8f4f8] text-sm font-bold tracking-tight">DevCircle</span>
          </div>
          <p className="text-xs text-[#2a5a6e] font-semibold uppercase tracking-widest">Messages</p>
        </div>

        {/* Chatting with */}
        <div className="px-3 py-3 flex-shrink-0">
          <p className="text-xs text-[#1a3a4a] uppercase tracking-widest font-semibold px-1 mb-2">Chatting with</p>
          <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-xl px-3 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f6e56] border border-[#1D9E75]/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {targetUser?.photoUrl ? (
                <img src={targetUser.photoUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-[#5DCAA5] text-xs font-bold">{targetInitials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#e8f4f8] text-xs font-semibold truncate">
                {targetName || "—"}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
                <p className="text-[#1D9E75] text-xs">Active now</p>
              </div>
            </div>
          </div>
        </div>

        {/* You */}
        <div className="px-3 mt-1 flex-shrink-0">
          <p className="text-xs text-[#1a3a4a] uppercase tracking-widest font-semibold px-1 mb-2">You</p>
          <div className="px-3 py-2.5 flex items-center gap-3 bg-[#0a1628] border border-[#1a3a4a] rounded-xl">
            <div className="w-8 h-8 rounded-xl bg-[#0d1b2a] border border-[#1a3a4a] flex items-center justify-center flex-shrink-0 overflow-hidden">
              {currentUser?.photoUrl ? (
                <img src={currentUser.photoUrl} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-[#4a7a8a] text-xs font-bold">{myInitials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#4a7a8a] text-xs font-semibold truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-[#1a3a4a] text-xs">{currentUser?.emailId}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0" />

        {/* Back */}
        <div className="px-3 py-4 border-t border-[#1a3a4a] flex-shrink-0">
          <a
            href="/connections"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#2a5a6e] hover:text-[#4a7a8a] hover:bg-[#0f2236] transition-all text-xs font-semibold"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to connections
          </a>
        </div>
      </div>

      {/* ── Chat column ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* Header */}
        <div className="bg-[#0d1b2a] border-b border-[#1a3a4a] px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
          <a href="/connections" className="lg:hidden text-[#2a5a6e] hover:text-[#4a7a8a] mr-1">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <div className="w-9 h-9 rounded-xl bg-[#0f6e56]/10 border border-[#0f6e56]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {targetUser?.photoUrl ? (
              <img src={targetUser.photoUrl} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="text-[#1D9E75] text-sm font-bold">{targetInitials}</span>
            )}
          </div>
          <div>
            <p className="text-[#e8f4f8] font-semibold text-sm leading-none">
              {targetName || "—"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1D9E75]" />
              <p className="text-[#1D9E75] text-xs">Online</p>
            </div>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-[#1a3a4a]">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Messages — only this scrolls */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 min-h-0">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0d1b2a] border border-[#1a3a4a] flex items-center justify-center">
                <span className="text-[#1D9E75] text-xl">💬</span>
              </div>
              <div className="text-center">
                <p className="text-[#e8f4f8] text-sm font-semibold mb-1">No messages yet</p>
                <p className="text-[#2a5a6e] text-xs">
                  {targetName ? `Say hello to ${targetName}!` : "Start the conversation!"}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.senderId?.toString() === currentUser?._id?.toString();
            const showName = !isMe && (i === 0 || messages[i - 1]?.senderId?.toString() !== msg.senderId?.toString());
            const isLastInGroup = i === messages.length - 1 || messages[i + 1]?.senderId?.toString() !== msg.senderId?.toString();
            return (
              <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {showName && (
                  <span className="text-[#2a5a6e] text-xs mb-1 ml-1 font-medium">
                    {msg.firstName} {msg.lastName}
                  </span>
                )}
                <div className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed break-words ${
                  isMe
                    ? "bg-[#0f6e56] text-white rounded-2xl rounded-br-sm"
                    : "bg-[#0d1b2a] border border-[#1a3a4a] text-[#c8dce6] rounded-2xl rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
                {isLastInGroup && (
                  <span className="text-[#1a3a4a] text-xs mt-1 mx-1">{formatTime(msg.createdAt)}</span>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar — always pinned at bottom */}
        <div className="bg-[#0d1b2a] border-t border-[#1a3a4a] px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={targetName ? `Message ${targetName}...` : "Type a message..."}
              className="flex-1 bg-[#0a1628] border border-[#1a3a4a] focus:border-[#1D9E75] text-[#e8f4f8] placeholder-[#2a5a6e] rounded-xl px-4 py-3 text-sm outline-none transition-colors min-w-0"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="bg-[#0f6e56] hover:bg-[#0d5f4a] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0 shadow-md shadow-[#0f6e56]/20"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-[#1a3a4a] mt-2">Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  );
};

export default Chat;