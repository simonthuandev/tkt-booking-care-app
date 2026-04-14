import { useState, useEffect } from 'react'
import * as Home from "../../components/Home";
import Footer from "../../components/Footer";
import "./HomePage.scss";

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
      <Home.SpecialtiesSection />
      <Home.HowSection />
      <Home.DoctorsSection />
      <Home.HospitalSection />
      <Home.ServicesSection />
      <Home.TestimonialsSection />
      <Home.NewsSection />
      <Home.PartnerSection />
      <Footer />
    </>
  );
}
