import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ExternalLink, Heart, Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import BookingModal from './BookingModal';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { t, currentLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: "#booking", label: t('nav.booking') },
    { href: "#websites", label: t('nav.websites') },
    { href: "#apps", label: t('nav.apps') },
    { href: "#commerce", label: t('nav.commerce') },
    { href: "#services", label: t('nav.services') },
    { href: "#contact", label: t('nav.contact') }
  ];

  // Create full paths with language code
  const getFullPath = (path: string) => {
    // Extract the base path without hash
    const basePath = location.pathname.split('#')[0];
    // If path is a hash, append it to the current base path
    if (path.startsWith('#')) {
      return `${basePath}${path}`;
    }
    // Otherwise, create a new path with the language code
    return `/${currentLanguage.code}/${path.replace(/^\//, '')}`;
  };

  return (
    <>
      <motion.header 
        className={`sticky top-0 z-40 transition-all duration-500 ${
          isScrolled 
            ? 'glass-card shadow-2xl border-b border-white/30' 
            : 'bg-white/70 backdrop-blur-md shadow-lg'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-5">
            <motion.div 
              className="flex items-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Link to={`/${currentLanguage.code}/`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <img 
                    src="/Axiestudiologo.jpg" 
                    alt="Axie Studio" 
                    className="relative h-10 sm:h-12 w-auto transition-all duration-300 group-hover:brightness-110"
                  />
                </div>
              </Link>
            </motion.div>
            
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={getFullPath(item.href)}
                  className="group relative px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-sm xl:text-base font-semibold overflow-hidden"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-xl" />
                  <span className="relative">{item.label}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"
                  />
                </motion.a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-3">
              <LanguageSwitcher />
              
              <motion.button
                onClick={() => setIsBookingModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-500 flex items-center text-sm shadow-lg hover:shadow-glow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Calendar className="mr-2 relative z-10" size={16} />
                <span className="relative z-10">{t('nav.bookTime')}</span>
              </motion.button>

              <motion.a 
                href="https://app.axiestudio.se/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 flex items-center text-sm shadow-lg hover:shadow-glow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Heart className="mr-2 relative z-10 animate-pulse" size={16} />
                <span className="relative z-10">{t('nav.login')}</span>
                <ExternalLink className="ml-2 group-hover:translate-x-1 group-hover:scale-110 transition-all relative z-10" size={16} />
                <Sparkles className="absolute top-1 right-1 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
              </motion.a>
            </div>

            <motion.button
              className="lg:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 glass-card"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} className="text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} className="text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="lg:hidden py-6 border-t border-white/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      href={getFullPath(item.href)}
                      className="flex items-center px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 rounded-xl font-semibold glass-card"
                      onClick={() => setIsMenuOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  
                  <div className="px-6 py-2">
                    <LanguageSwitcher />
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      setIsBookingModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-500 flex items-center justify-center mt-4 shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar className="mr-2" size={18} />
                    {t('nav.bookTime')}
                  </motion.button>
                  
                  <motion.a 
                    href="https://app.axiestudio.se/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-500 flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Heart className="mr-2 animate-pulse" size={18} />
                    {t('nav.login')}
                    <ExternalLink className="ml-2" size={18} />
                  </motion.a>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </>
  );
};

export default Header;