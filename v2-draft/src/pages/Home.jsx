import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import AgencySection from '../components/AgencySection';
import CodeDiffTerminal from '../components/CodeDiffTerminal';
import ArchitectureGraph from '../components/ArchitectureGraph';
import Services from '../components/Services';
import CaseStudySection from '../components/CaseStudySection';
import FounderSection from '../components/FounderSection';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import { formatDocumentTitle } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const Home = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isTr = isTurkish(i18n);
    document.title = isTr
      ? "Trend Master Akademi | Incident Triage & Systems Architecture"
      : formatDocumentTitle("Trend Master Academy | Incident Triage & Systems Architecture");
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Kritik sistem kesintileri, kilitlenen kod tabanları ve yüksek işlem hacimli platformlar için çekirdek seviyesinde mühendislik masası."
        : "Kernel-level systems engineering and incident triage desk for mission-critical platforms, locked codebases, and high-concurrency environments."
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://trendmasterakademi.com/');
    }
  }, [i18n.language]);

  return (
    <>
      <Hero />
      <AgencySection />
      <CodeDiffTerminal />
      <ArchitectureGraph />
      <Services />
      <CaseStudySection />
      <FounderSection />
      <FAQ />
      <Contact />
    </>
  );
};

export default Home;
