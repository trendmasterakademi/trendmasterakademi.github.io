import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import AgencySection from '../components/AgencySection';
import CodeDiffTerminal from '../components/CodeDiffTerminal';
import ArchitectureGraph from '../components/ArchitectureGraph';
import Services from '../components/Services';
import CaseStudySection from '../components/CaseStudySection';
import FounderSection from '../components/FounderSection';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import { setPageSeo } from '../utils/pageTitle';
import { isTurkish } from '../i18n';

const Tanitim = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const isTr = isTurkish(i18n);
    const path = isTr ? '/tanitim/' : '/overview/';
    setPageSeo(path, isTr ? 'tr' : 'en');
  }, [i18n.language, location.pathname]);

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

export default Tanitim;
