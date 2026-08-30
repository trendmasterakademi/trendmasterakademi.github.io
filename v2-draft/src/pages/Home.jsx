import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import AgencySection from '../components/AgencySection';
import ArchitectureGraph from '../components/ArchitectureGraph';
import Services from '../components/Services';
import CaseStudySection from '../components/CaseStudySection';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import { formatDocumentTitle } from '../utils/pageTitle';

const Home = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isTr = i18n.language !== 'en';
    document.title = isTr
      ? "Trend Master Akademi | B2B Mühendislik & Kod Kurtarma"
      : formatDocumentTitle("Trend Master Academy | B2B Technical SWAT & White-Label Engineering");
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isTr
        ? "Dijital ajanslar ve teknoloji şirketleri için B2B White-Label Mühendislik Masası, Acil Kod Kurtarma (SWAT), SaaS Mimarisi ve Kriz Çözüm Stüdyosu."
        : "Behind-the-scenes B2B Technical SWAT, White-Label Engineering desk, and emergency code rescue studio for digital agencies and SaaS companies."
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
      <ArchitectureGraph />
      <Services />
      <CaseStudySection />
      <FAQ />
      <Contact />
    </>
  );
};

export default Home;
