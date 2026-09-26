import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';
import { isTurkish } from './i18n';
import { sayfa } from './utils/sayfaYukle';

// Route-based code-split components
const Home = sayfa('Home', () => import('./pages/Home'));
const Agency = sayfa('Agency', () => import('./pages/Agency'));
const AgencyKit = sayfa('AgencyKit', () => import('./pages/AgencyKit'));
const CrashTest = sayfa('CrashTest', () => import('./pages/CrashTest'));
const DevirKontrolu = sayfa('DevirKontrolu', () => import('./pages/DevirKontrolu'));
const GlossaryIndex = sayfa('GlossaryIndex', () => import('./pages/GlossaryIndex'));
const GlossaryTerm = sayfa('GlossaryTerm', () => import('./pages/GlossaryTerm'));
const KesintiMaliyeti = sayfa('KesintiMaliyeti', () => import('./pages/KesintiMaliyeti'));
const About = sayfa('About', () => import('./pages/About'));
const Story = sayfa('Story', () => import('./pages/Story'));
const Privacy = sayfa('Privacy', () => import('./pages/Privacy'));
const Nda = sayfa('Nda', () => import('./pages/Nda'));
const TeshisIndex = sayfa('TeshisIndex', () => import('./pages/TeshisIndex'));
const TeshisDetay = sayfa('TeshisDetay', () => import('./pages/TeshisDetay'));
const Sos = sayfa('Sos', () => import('./pages/Sos'));
const Salvageability = sayfa('Salvageability', () => import('./pages/Salvageability'));
const PostMortemIndex = sayfa('PostMortemIndex', () => import('./pages/PostMortemIndex'));
const PostMortemDetail = sayfa('PostMortemDetail', () => import('./pages/PostMortemDetail'));
const Triage = sayfa('Triage', () => import('./pages/Triage'));
const Sla = sayfa('Sla', () => import('./pages/Sla'));
const TechMatrix = sayfa('TechMatrix', () => import('./pages/TechMatrix'));
const NdaGenerator = sayfa('NdaGenerator', () => import('./pages/NdaGenerator'));
const OutageSimulator = sayfa('OutageSimulator', () => import('./pages/OutageSimulator'));
const StatusRadar = sayfa('StatusRadar', () => import('./pages/StatusRadar'));
const CodeHealth = sayfa('CodeHealth', () => import('./pages/CodeHealth'));
const RescueRoi = sayfa('RescueRoi', () => import('./pages/RescueRoi'));
const Tmai = sayfa('Tmai', () => import('./pages/Tmai'));
const Tanitim = sayfa('Tanitim', () => import('./pages/Tanitim'));
const NotFound = sayfa('NotFound', () => import('./pages/NotFound'));

// Lightweight, thematic skeleton fallback matching pre-render aesthetic
const PageFallback = () => (
  <div className="min-h-[70vh] pt-32 pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
    <div className="w-48 h-6 bg-[var(--rule)] rounded-[var(--r-control)]"></div>
    <div className="w-3/4 max-w-lg h-10 bg-[var(--rule)] rounded-[var(--r-control)]"></div>
    <div className="w-full max-w-md h-4 bg-[var(--rule)] rounded-[var(--r-control)]"></div>
    <div className="w-2/3 max-w-sm h-4 bg-[var(--rule)] rounded-[var(--r-control)]"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-6">
      <div className="h-28 bg-[var(--surface)] rounded-[var(--r-panel)] border border-[var(--rule)]"></div>
      <div className="h-28 bg-[var(--surface)] rounded-[var(--r-panel)] border border-[var(--rule)]"></div>
      <div className="h-28 bg-[var(--surface)] rounded-[var(--r-panel)] border border-[var(--rule)]"></div>
    </div>
  </div>
);

function App() {
  const { i18n } = useTranslation();
  const isTr = isTurkish(i18n);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[var(--paper)] text-[var(--ink-2)] selection:bg-[var(--accent)] selection:text-[var(--on-accent)] w-full max-w-full relative font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[var(--accent)] focus:text-[var(--on-accent)] focus:font-medium focus:text-sm focus:rounded-[var(--r-control)] focus:shadow-navbar focus:outline-none transition-all"
        >
          {isTr ? 'İçeriğe atla' : 'Skip to content'}
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="w-full max-w-full outline-none">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/tanitim/" element={<Tanitim />} />
              <Route path="/tanitim" element={<Tanitim />} />
              <Route path="/overview/" element={<Tanitim />} />
              <Route path="/overview" element={<Tanitim />} />
              
              <Route path="/agency/" element={<Agency />} />
              <Route path="/agency" element={<Agency />} />
              
              <Route path="/kit/" element={<AgencyKit lang="tr" />} />
              <Route path="/kit" element={<AgencyKit lang="tr" />} />
              <Route path="/agency-kit/" element={<AgencyKit lang="en" />} />
              <Route path="/agency-kit" element={<AgencyKit lang="en" />} />
              
              <Route path="/crash-test/" element={<CrashTest />} />
              <Route path="/crash-test" element={<CrashTest />} />
              
              <Route path="/devir-kontrolu/" element={<DevirKontrolu />} />
              <Route path="/devir-kontrolu" element={<DevirKontrolu />} />
              <Route path="/handover-audit/" element={<DevirKontrolu />} />
              <Route path="/handover-audit" element={<DevirKontrolu />} />
              
              <Route path="/sozluk/" element={<GlossaryIndex />} />
              <Route path="/sozluk" element={<GlossaryIndex />} />
              <Route path="/glossary/" element={<GlossaryIndex />} />
              <Route path="/glossary" element={<GlossaryIndex />} />
              
              <Route path="/sozluk/:slug/" element={<GlossaryTerm />} />
              <Route path="/sozluk/:slug" element={<GlossaryTerm />} />
              <Route path="/glossary/:slug/" element={<GlossaryTerm />} />
              <Route path="/glossary/:slug" element={<GlossaryTerm />} />
              
              <Route path="/kesinti-maliyeti/" element={<KesintiMaliyeti />} />
              <Route path="/kesinti-maliyeti" element={<KesintiMaliyeti />} />
              <Route path="/downtime-calc/" element={<KesintiMaliyeti />} />
              <Route path="/downtime-calc" element={<KesintiMaliyeti />} />
              <Route path="/downtime-cost/" element={<KesintiMaliyeti />} />
              <Route path="/downtime-cost" element={<KesintiMaliyeti />} />
              
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
              <Route path="/diagnostic/" element={<TeshisIndex />} />
              <Route path="/diagnostic" element={<TeshisIndex />} />
              <Route path="/diagnostics/" element={<TeshisIndex />} />
              <Route path="/diagnostics" element={<TeshisIndex />} />

              <Route path="/teshis/:slug/" element={<TeshisDetay />} />
              <Route path="/teshis/:slug" element={<TeshisDetay />} />
              <Route path="/diagnostic/:slug/" element={<TeshisDetay />} />
              <Route path="/diagnostic/:slug" element={<TeshisDetay />} />
              <Route path="/diagnostics/:slug/" element={<TeshisDetay />} />
              <Route path="/diagnostics/:slug" element={<TeshisDetay />} />
              
              <Route path="/sos/" element={<Sos />} />
              <Route path="/sos" element={<Sos />} />
              
              <Route path="/kurtarilabilirlik/" element={<Salvageability />} />
              <Route path="/kurtarilabilirlik" element={<Salvageability />} />
              <Route path="/salvageability/" element={<Salvageability />} />
              <Route path="/salvageability" element={<Salvageability />} />

              <Route path="/post-mortem/" element={<PostMortemIndex />} />
              <Route path="/post-mortem" element={<PostMortemIndex />} />
              <Route path="/post-mortems/" element={<PostMortemIndex />} />
              <Route path="/post-mortems" element={<PostMortemIndex />} />

              <Route path="/post-mortem/:slug/" element={<PostMortemDetail />} />
              <Route path="/post-mortem/:slug" element={<PostMortemDetail />} />
              <Route path="/post-mortems/:slug/" element={<PostMortemDetail />} />
              <Route path="/post-mortems/:slug" element={<PostMortemDetail />} />

              <Route path="/triyaj/" element={<Triage />} />
              <Route path="/triyaj" element={<Triage />} />
              <Route path="/triage/" element={<Triage />} />
              <Route path="/triage" element={<Triage />} />

              <Route path="/sla/" element={<Sla />} />
              <Route path="/sla" element={<Sla />} />

              <Route path="/teknoloji-uyumluluk/" element={<TechMatrix lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/teknoloji-uyumluluk" element={<TechMatrix lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/tech-matrix/" element={<TechMatrix lang="en" />} />
              <Route path="/tech-matrix" element={<TechMatrix lang="en" />} />

              <Route path="/gizlilik-sozlesmesi/" element={<NdaGenerator lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/gizlilik-sozlesmesi" element={<NdaGenerator lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/mutual-nda/" element={<NdaGenerator lang="en" />} />
              <Route path="/mutual-nda" element={<NdaGenerator lang="en" />} />

              <Route path="/hasar-tespiti/" element={<OutageSimulator lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/hasar-tespiti" element={<OutageSimulator lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/outage-simulator/" element={<OutageSimulator lang="en" />} />
              <Route path="/outage-simulator" element={<OutageSimulator lang="en" />} />

              <Route path="/radar/" element={<StatusRadar lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/radar" element={<StatusRadar lang={isTr ? 'tr' : 'en'} />} />

              <Route path="/kod-sagligi/" element={<CodeHealth lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/kod-sagligi" element={<CodeHealth lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/codebase-health/" element={<CodeHealth lang="en" />} />
              <Route path="/codebase-health" element={<CodeHealth lang="en" />} />

              <Route path="/kurtarma-maliyeti/" element={<RescueRoi lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/kurtarma-maliyeti" element={<RescueRoi lang={isTr ? 'tr' : 'en'} />} />
              <Route path="/rescue-roi/" element={<RescueRoi lang="en" />} />
              <Route path="/rescue-roi" element={<RescueRoi lang="en" />} />

              <Route path="/tmai/" element={<Tmai />} />
              <Route path="/tmai" element={<Tmai />} />
              <Route path="/ai-code-takeover/" element={<Tmai />} />
              <Route path="/ai-code-takeover" element={<Tmai />} />

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
