import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import GithubRepos from '../components/GithubRepos';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <GithubRepos />
      <Testimonials />
      <Contact />
    </>
  );
};

export default Home;
