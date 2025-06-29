import AureaLogo from "./AureaLogo";

export default function Hero() {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <AureaLogo />
    </div>
  );
}