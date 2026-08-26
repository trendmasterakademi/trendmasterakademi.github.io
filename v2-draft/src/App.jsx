import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import Home from './pages/Home';
import About from './pages/About';
import Agency from './pages/Agency';
import CrashTest from './pages/CrashTest';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#080b11] text-slate-200 selection:bg-cyan-500 selection:text-black overflow-x-hidden w-full max-w-full relative">
        <Navbar />
        <main className="overflow-x-hidden w-full max-w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/crash-test" element={<CrashTest />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </Router>
  );
}

export default App;
