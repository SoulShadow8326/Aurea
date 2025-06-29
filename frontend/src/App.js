import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Try from "./pages/Try";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Background from "./components/Background";

function App() {
  return (
    <>
      <Background />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/try" element={<Try />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;