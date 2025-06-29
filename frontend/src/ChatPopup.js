import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AUREA_CONTEXT = `Aurea is a real-time AI-powered assistant that transforms how we understand and fix color in design, especially for accessibility. It allows artists to upload an image, instantly extract and get their palette analyzed, and uses Gemini to assess harmony, contrast, and emotional tone. But more importantly, Aurea doesn’t stop at analysis. It actively simulates how the artwork appears to people with different types of colorblindness, and then converts it back into a palette optimized for normal vision, preserving the mood, composition and intent. For colorblinded artists, this means they can verify how their work appears to non-color blind viewers, as it will change colourblind artworks into normal colours. Aurea then calls Gemini to narrate the palette: emotionally, culturally, and technically. It tells the user what they are actually communicating through color and how to fix it if it's missing the mark. Aurea is about design as inclusion. It doesn’t flag inaccessible palettes, it fixes them. It doesn’t guess how a colorblind person might see your work, it shows you, and helps you bridge the gap. This is accessibility baked into creativity, not added on top as an afterthought. Target audience: colorblind artists, designers, students, teachers, and anyone who cares about color accessibility and inclusion. Gemini, you are Aurea's assistant. Respond as a helpful, insightful, and creative design assistant.`;

export default function ChatPopup({ onOpenChat }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

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
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
      {open ? (
        <div style={{ width: 400, height: 620, background: "rgba(24,28,36,0.92)", borderRadius: 20, boxShadow: "0 8px 32px rgba(42,119,245,0.18)", display: "flex", flexDirection: "column", overflow: "hidden", backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "center", height: 38, padding: "0 18px", borderBottom: "1px solid #23283a", background: "rgba(24,28,36,0.85)" }}>
            <div style={{ display: "flex", gap: 7 }}>
              <div onClick={() => setOpen(false)} style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f56", cursor: "pointer", border: "1px solid #e0443e", boxShadow: "0 1px 2px #0002" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ffbd2e", border: "1px solid #dea123", boxShadow: "0 1px 2px #0002" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#27c93f", border: "1px solid #13a10e", boxShadow: "0 1px 2px #0002" }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, background: "rgba(26,34,54,0.85)", transition: "background 0.2s", display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", width: "100%" }}>
                <span style={{ display: "inline-block", padding: "12px 18px", borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.sender === "user" ? "#FEAD13" : "rgba(35,43,62,0.92)", color: msg.sender === "user" ? "#222" : "#fff", maxWidth: 320, wordBreak: "break-word", fontSize: 16, boxShadow: msg.sender === "user" ? "0 2px 8px #FEAD1333" : "0 1px 4px #0002", marginBottom: 2 }}>{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ padding: 16, borderTop: "1px solid #23283a", background: "rgba(24,28,36,0.85)", display: "flex", flexDirection: "row", gap: 8, alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ flex: 1, resize: "none", borderRadius: 18, border: "1.5px solid #23283a", padding: "10px 14px", fontSize: 16, background: "rgba(35,43,62,0.92)", color: "#fff", outline: "none", boxShadow: "0 1px 4px #0002", minHeight: 44, maxHeight: 120, lineHeight: 1.5 }}
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              style={{ background: "#FEAD13", color: "#222", border: "none", borderRadius: 18, padding: "0 22px", fontWeight: 700, fontSize: 17, cursor: "pointer", boxShadow: "0 2px 8px #FEAD1333", height: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 0.2, transition: "background 0.15s" }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/chat')}
          style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEAD13", color: "#fff", border: "none", fontSize: 28, fontWeight: 700, boxShadow: "0 2px 12px #FEAD1355", cursor: "pointer" }}
        >
        </button>
      )}
    </div>
  );
}
