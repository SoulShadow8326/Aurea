import React from "react";

export default function ChatOverlay({ open, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        display: open ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(24,28,36,0.82)",
        transition: "opacity 0.35s cubic-bezier(.4,0,.2,1)",
        animation: open ? "chatOverlayIn 0.35s cubic-bezier(.4,0,.2,1)" : "none"
      }}
      onClick={onClose}
    >
      <div
        style={{
          minHeight: 700,
          minWidth: 520,
          maxWidth: "98vw",
          maxHeight: "90vh",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(42,119,245,0.18)",
          background: "rgba(24,28,36,0.92)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          animation: open ? "chatCardIn 0.45s cubic-bezier(.4,0,.2,1)" : "none"
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
      <style>{`
        @keyframes chatOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chatCardIn {
          from { transform: translateY(60px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
