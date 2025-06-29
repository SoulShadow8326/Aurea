import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      let reply = data.reply || "Sorry, I couldn't get a response.";
      setMessages((msgs) => [...msgs, { sender: "llm", text: reply }]);
    } catch {
      setMessages((msgs) => [...msgs, { sender: "llm", text: "Error: could not get response." }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", background: "#16213e", padding: 0, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <div className="page" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} />
      </div>
      <div style={{ width: 1000, maxWidth: "98vw", height: 760, background: "rgba(24,28,36,0.45)", borderRadius: 32, boxShadow: "0 16px 64px 0 rgba(42,119,245,0.22)", display: "flex", flexDirection: "column", overflow: "hidden", backdropFilter: "blur(24px)", position: "relative", zIndex: 1, border: "1.5px solid #23283a" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", height: 64, padding: "0 0 0 32px", background: "rgba(24,28,36,0.08)", borderBottom: "1.5px solid #23283a", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div onClick={() => navigate('/')} style={{ width: 14, height: 14, borderRadius: 7, background: "#ff5f56", border: "1.5px solid #e0443e", cursor: "pointer", boxShadow: "0 1px 2px #0002" }} />
            <div onClick={() => navigate('/')} style={{ width: 14, height: 14, borderRadius: 7, background: "#ffbd2e", border: "1.5px solid #dea123", cursor: "pointer", boxShadow: "0 1px 2px #0002" }} />
            <div onClick={() => navigate('/')} style={{ width: 14, height: 14, borderRadius: 7, background: "#27c93f", border: "1.5px solid #13a10e", cursor: "pointer", boxShadow: "0 1px 2px #0002" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "48px 64px 32px 64px", background: "rgba(26,34,54,0.10)", transition: "background 0.2s", display: "flex", flexDirection: "column", gap: 28, justifyContent: messages.length === 0 ? "center" : "flex-end", alignItems: messages.length === 0 ? "center" : "stretch" }}>
          {messages.length === 0 && (
            <div style={{ color: "#fff", opacity: 0.92, fontSize: 32, textAlign: "center", fontWeight: 700, letterSpacing: 0.1, marginBottom: 12, marginTop: -40, lineHeight: 1.2 }}>
              Welcome to Aurea Chat
              <div style={{ fontSize: 20, fontWeight: 500, opacity: 0.7, marginTop: 18, maxWidth: 520 }}>
                Ask anything about color, accessibility, palettes, or design. Powered by Gemini. Try prompts like:<br /><br />
                <span style={{ color: "#FF8b00", fontWeight: 700 }}>
                  How do I make my palette more accessible?<br />
                  What mood does this color scheme give?<br />
                  Suggest a palette for a calm, inclusive design.<br />
                </span>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", width: "100%" }}>
              <span style={{
                display: "inline-block",
                padding: "18px 28px",
                borderRadius: msg.sender === "user" ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
                background: msg.sender === "user" ? "#26272b" : "#23242a",
                color: "#fff",
                maxWidth: 800,
                wordBreak: "break-word",
                fontSize: 19,
                boxShadow: msg.sender === "user"
                  ? "0 2px 8px #0002"
                  : "0 2px 8px #0002",
                marginBottom: 2,
                lineHeight: 1.7,
                fontWeight: 500,
                border: msg.sender === "user" ? "1.5px solid #35363a" : "1.5px solid #2a2b2f"
              }}>{msg.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: "36px 64px", borderTop: "1.5px solid #23283a", background: "rgba(24,28,36,0.10)", display: "flex", flexDirection: "row", gap: 18, alignItems: "stretch" }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{ flex: 1, resize: "none", borderRadius: 20, border: "1.5px solid #23283a", padding: "0 24px", fontSize: 20, background: "rgba(35,43,62,0.45)", color: "#fff", outline: "none", boxShadow: "0 2px 8px #0002", minHeight: 56, maxHeight: 56, lineHeight: "56px", fontWeight: 500, height: 56 }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            style={{ background: "#2977F5", color: "#fff", border: "none", borderRadius: 18, padding: "0 38px", fontWeight: 800, fontSize: 21, cursor: "pointer", boxShadow: "0 2px 12px #2977F533", height: 56, minWidth: 56, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.2, transition: "background 0.15s" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
