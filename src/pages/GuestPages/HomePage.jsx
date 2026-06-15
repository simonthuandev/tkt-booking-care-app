import { useState, useEffect } from 'react'
import * as Home from "../../components/Home";
import Footer from "../../components/Footer";
import { publicStatsService } from "../../api/appService";
import "./HomePage.scss";
import Chatbot from '../../components/Common/Chatbot';
import ScrollToTopButton from '../../components/Common/ScrollToTopButton';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [publicStats, setPublicStats] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    publicStatsService
      .getStats()
      .then((res) => {
        if (!isMounted) return;
        setPublicStats(res.data?.data || null);
      })
      .catch((err) => {
        console.error("Lỗi lấy thống kê công khai:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Home.HomeNav scrolled={scrolled} />
      <Home.HeroSection stats={publicStats} />
      <Home.StatsBand stats={publicStats} />
      <Home.HowSection />
      <Home.SpecialtiesSection />
      <Home.HospitalSection />
      <Home.DoctorsSection />
      <Footer />
      <ScrollToTopButton />
      <Chatbot />
    </>
  );
}
