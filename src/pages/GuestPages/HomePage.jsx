import { useState, useEffect } from 'react'
import * as Home from "../../components/Home";
import Footer from "../../components/Footer";
import "./HomePage.scss";
import Chatbot from '../../components/Common/Chatbot';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Home.HomeNav scrolled={scrolled} />
      <Home.HeroSection />
      <Home.StatsBand />
      <Home.HowSection />
      <Home.SpecialtiesSection />
      <Home.HospitalSection />
      <Home.DoctorsSection />
      <Footer />
      <Chatbot />
    </>
  );
}
