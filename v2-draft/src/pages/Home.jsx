import React from 'react';
import Hero from '../components/Hero';
import AgencySection from '../components/AgencySection';
import CodeDiffShowcase from '../components/CodeDiffShowcase';
import ArchitectureGraph from '../components/ArchitectureGraph';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <AgencySection />
      <CodeDiffShowcase />
      <ArchitectureGraph />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;
