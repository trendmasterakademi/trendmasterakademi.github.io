import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';

// Route-based code-split components
const Home = lazy(() => import('./pages/Home'));
const Agency = lazy(() => import('./pages/Agency'));
const CrashTest = lazy(() => import('./pages/CrashTest'));
const DevirKontrolu = lazy(() => import('./pages/DevirKontrolu'));
const GlossaryIndex = lazy(() => import('./pages/GlossaryIndex'));
const GlossaryTerm = lazy(() => import('./pages/GlossaryTerm'));
const KesintiMaliyeti = lazy(() => import('./pages/KesintiMaliyeti'));
const About = lazy(() => import('./pages/About'));
const Story = lazy(() => import('./pages/Story'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Nda = lazy(() => import('./pages/Nda'));
const TeshisIndex = lazy(() => import('./pages/TeshisIndex'));
const TeshisDetay = lazy(() => import('./pages/TeshisDetay'));
const Sos = lazy(() => import('./pages/Sos'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lightweight, thematic skeleton fallback matching pre-render aesthetic
const PageFallback = () => (
  <div className="min-h-[70vh] pt-32 pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
    <div className="w-48 h-6 bg-cyan-500/20 rounded-full border border-cyan-500/30"></div>
    <div className="w-3/4 max-w-lg h-10 bg-white/10 rounded-2xl"></div>
    <div className="w-full max-w-md h-4 bg-white/5 rounded-lg"></div>
    <div className="w-2/3 max-w-sm h-4 bg-white/5 rounded-lg"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-6">
      <div className="h-28 bg-white/5 rounded-2xl border border-white/5"></div>
      <div className="h-28 bg-white/5 rounded-2xl border border-white/5"></div>
      <div className="h-28 bg-white/5 rounded-2xl border border-white/5"></div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#080b11] text-slate-200 selection:bg-cyan-500 selection:text-black w-full max-w-full relative font-sans">
        <Navbar />
        <main className="w-full max-w-full">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/agency/" element={<Agency />} />
              <Route path="/agency" element={<Agency />} />
              
              <Route path="/crash-test/" element={<CrashTest />} />
              <Route path="/crash-test" element={<CrashTest />} />
              
              <Route path="/devir-kontrolu/" element={<DevirKontrolu />} />
              <Route path="/devir-kontrolu" element={<DevirKontrolu />} />
              
              <Route path="/sozluk/" element={<GlossaryIndex />} />
              <Route path="/sozluk" element={<GlossaryIndex />} />
              
              <Route path="/sozluk/:slug/" element={<GlossaryTerm />} />
              <Route path="/sozluk/:slug" element={<GlossaryTerm />} />
              
              <Route path="/kesinti-maliyeti/" element={<KesintiMaliyeti />} />
              <Route path="/kesinti-maliyeti" element={<KesintiMaliyeti />} />
              
              <Route path="/about/" element={<About />} />
              <Route path="/about" element={<About />} />
              
              <Route path="/hikayemiz/" element={<Story />} />
              <Route path="/hikayemiz" element={<Story />} />
              <Route path="/story/" element={<Story />} />
              <Route path="/story" element={<Story />} />
              
              <Route path="/privacy/" element={<Privacy />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/gizlilik/" element={<Privacy />} />
              <Route path="/gizlilik" element={<Privacy />} />
              <Route path="/kvkk/" element={<Privacy />} />
              <Route path="/kvkk" element={<Privacy />} />
              
              <Route path="/nda/" element={<Nda />} />
              <Route path="/nda" element={<Nda />} />
              
              <Route path="/teshis/" element={<TeshisIndex />} />
              <Route path="/teshis" element={<TeshisIndex />} />
              <Route path="/teshis/:slug/" element={<TeshisDetay />} />
              <Route path="/teshis/:slug" element={<TeshisDetay />} />
              
              <Route path="/sos/" element={<Sos />} />
              <Route path="/sos" element={<Sos />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingActions />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
