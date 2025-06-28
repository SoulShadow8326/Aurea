import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Try from './pages/Try';
import About from './pages/About';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bg from './components/Bg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './components/Footer';
import Results from './pages/Results';


import Textp1 from './components/Textp1'

function App() {
  return (
    <Router> 
      <Navbar />
      <Bg>
      
<Routes>
  <Route path="/" element={
    <>
  <Textp1 />
  <Hero />
      
    </>
    
    
  } />
  <Route path="/About" element={<About />} />
  <Route path="/Try" element={<Try />} />
  <Route path="/Results" element={<Results />} />
</Routes>
</Bg>
<Footer />

    </Router>
  );
}

export default App;