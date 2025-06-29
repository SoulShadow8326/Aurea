import { useState } from "react";

const simulationOptions = [
  { value: "", label: "Normal" },
  { value: "protanopia", label: "Protanopia" },
  { value: "deuteranopia", label: "Deuteranopia" },
  { value: "tritanopia", label: "Tritanopia" },
  { value: "achromatopsia", label: "Achromatopsia" },
];

function Try() {
  const [file, setFile] = useState(null);
  const [simulateType, setSimulateType] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copyColor, setCopyColor] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSimTypeChange = (e) => {
    setSimulateType(e.target.value);
    setResult(null);
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopyColor(color);
    setTimeout(() => setCopyColor(null), 1200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("simulateType", simulateType);
    formData.append("geminiApiKey", geminiApiKey);

    try {
      const res = await fetch(apiUrl, { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Failed to analyze image." });
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center"}}>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        margin: "4rem auto 2rem auto",
        padding: "2.8rem 3rem 2.4rem 3rem",
        background: "#fff",
        borderRadius: 28,
        boxShadow: "0 6px 38px 0 rgba(254, 173, 19, 0.07)",
        border: "3px solid #FEAD13"
      }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <select value={simulateType} onChange={handleSimTypeChange} style={{marginBottom: "1.2rem"}}>
          {simulationOptions.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading || !file} style={{
          background: "linear-gradient(90deg, #FEAD13 0%, #FFCF60 100%)",
          color: "#14142D",
          fontWeight: 800,
          fontSize: "1.17rem",
          padding: "1.1rem 2.5rem",
          borderRadius: 12,
          border: "none",
          letterSpacing: "0.04em",
          boxShadow: "0 3px 24px rgba(254,173,19,0.13)"
        }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
        {result && (
          <div className="result-section">
            {result.error && <div style={{color:"#FEAD13", fontWeight: 700}}>{result.error}</div>}
            <div className="result-images">
              {result.originalImage && (
                <div className="result-image-block">
                  <div style={{marginBottom: 8, fontWeight: 600, color: "#14142D"}}>Original</div>
                  <img src={result.originalImage} alt="original" />
                </div>
              )}
              {result.simulatedImage && (
                <div className="result-image-block">
                  <div style={{marginBottom: 8, fontWeight: 600, color: "#14142D"}}>
                    {simulationOptions.find((o) => o.value === simulateType)?.label || "Simulated"}
                  </div>
                  <img src={result.simulatedImage} alt="simulated" />
                </div>
              )}
            </div>
            {result.palette && (
              <>
                <div style={{fontWeight:700, color:"#14142D", margin:"2rem 0 0.7rem 0"}}>Palette</div>
                <div className="palette-row">
                  {result.palette.map((c) => (
                    <div
                      className={`palette-swatch${copyColor === c ? " copied" : ""}`}
                      style={{ background: c, color: (c === "#14142D" ? "#FEAD13" : "#14142D") }}
                      key={c}
                      onClick={() => handleCopy(c)}
                      title="Copy color"
                    >
                      {c}
                      <span className="tooltip">{copyColor === c ? "Copied!" : "Click to copy"}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {result.aiAnalysis && (
              <>
                <div style={{fontWeight:700, color:"#14142D", margin:"2rem 0 0.7rem 0"}}>AI Analysis</div>
                <pre className="analysis-json">
                  {typeof result.aiAnalysis === "object"
                    ? JSON.stringify(result.aiAnalysis, null, 2)
                    : result.aiAnalysis}
                </pre>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Try;