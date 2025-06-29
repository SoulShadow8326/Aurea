function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "2.1rem 0 1.2rem 0",
      fontSize: "1.08rem",
      color: "#FEAD13",
      fontWeight: 700,
      background: "none"
    }}>
      Made with Aurea • {new Date().getFullYear()}
    </footer>
  );
}
export default Footer;