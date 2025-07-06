import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import AdvancedSEO from '../components/SEO/AdvancedSEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BookingSection from '../components/BookingSection';
import WebsiteSection from '../components/WebsiteSection';
import AppSection from '../components/AppSection';
import CommerceSection from '../components/CommerceSection';
import Services from '../components/Services';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import PrivacyPolicy from '../components/PrivacyPolicy';
import TermsOfService from '../components/TermsOfService';

const MainLayout: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  
  // Handle hash navigation for sections
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen" dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
      <AdvancedSEO />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="websites" element={<WebsitesPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="commerce" element={<CommercePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />
        <Route path="terms" element={<TermsOfServicePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

// Page Components
const HomePage = () => (
  <>
    <Hero />
    <BookingSection />
    <WebsiteSection />
    <AppSection />
    <CommerceSection />
    <Services />
    <FAQ />
    <Contact />
  </>
);

const BookingPage = () => <BookingSection />;
const WebsitesPage = () => <WebsiteSection />;
const AppsPage = () => <AppSection />;
const CommercePage = () => <CommerceSection />;
const ServicesPage = () => <Services />;
const FAQPage = () => <FAQ />;
const ContactPage = () => <Contact />;
const PrivacyPolicyPage = () => <PrivacyPolicy />;
const TermsOfServicePage = () => <TermsOfService />;

export default MainLayout;