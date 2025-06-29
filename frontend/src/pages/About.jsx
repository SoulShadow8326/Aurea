function About() {
  return (
    <div style={{
      maxWidth: 700,
      margin: "5.5rem auto 0 auto",
      background: "rgba(255,255,255,0.97)",
      padding: "3.3rem 3.5rem 3.3rem 3.5rem",
      borderRadius: 26,
      boxShadow: "0 8px 40px rgba(254,173,19,0.13)",
      border: "3px solid #FEAD13",
      fontFamily: "'Montserrat', 'Poppins', 'Inter', sans-serif"
    }}>
      <h2 style={{
        background: "linear-gradient(90deg, #FEAD13 0%, #14142D 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: 900,
        fontSize: "2.1rem",
        letterSpacing: "0.04em",
        marginBottom: "1.8rem"
      }}>About Aurea</h2>
      <div style={{fontSize: "1.17rem", lineHeight: "1.65", color: "#14142D"}}>
        Aurea helps you analyze image palettes for accessibility and color harmony. Upload an image, choose a colorblindness simulation, and see both the extracted palette and how it appears to users with different types of color vision. Powered by AI, Aurea provides palette analysis, accessibility checks, and artistic descriptions.
      </div>
    </div>
  );
}
export default About;