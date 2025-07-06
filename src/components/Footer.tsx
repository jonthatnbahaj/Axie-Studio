import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white py-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <img 
                src="/Axiestudiologo.jpg" 
                alt="Axie Studio" 
                className="h-12 w-auto mr-4 rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/favicon.ico';
                }}
              />
              <div>
                <h3 className="text-2xl font-bold gradient-text-cosmic">Axie Studio</h3>
                <p className="text-gray-400 text-sm">{t('footer.tagline')}</p>
              </div>
            </div>
            
            <p className="text-xl font-semibold mb-4 gradient-text-aurora">
              {t('footer.slogan')}
            </p>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61573009403109" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl hover:bg-blue-600 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50"
              >
                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.instagram.com/axiestudi0/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-300 border border-gray-700/50 hover:border-pink-500/50"
              >
                <Instagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://www.youtube.com/@AxieStudio_se" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl hover:bg-red-600 transition-all duration-300 border border-gray-700/50 hover:border-red-500/50"
              >
                <Youtube size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Sparkles className="mr-2 text-blue-400" size={20} />
              {t('footer.services.title')}
            </h3>
            <ul className="space-y-3 text-gray-300">
              {t('footer.services.items', {}, '').map((item: any, index: number) => (
                <li key={index}>
                  <a href={item.href} className="hover:text-blue-400 transition-colors flex items-center group">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <Heart className="mr-2 text-pink-400 animate-pulse" size={20} />
              {t('footer.contact.title')}
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center group">
                <div className="bg-blue-500/20 p-2 rounded-lg mr-3 group-hover:bg-blue-500/30 transition-colors">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('footer.contact.email.label')}</p>
                  <a href="mailto:stefan@axiestudio.se" className="hover:text-blue-400 transition-colors font-medium">
                    {t('footer.contact.email.value')}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="bg-green-500/20 p-2 rounded-lg mr-3 group-hover:bg-green-500/30 transition-colors">
                  <Phone size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('footer.contact.phone.label')}</p>
                  <a href="tel:+46735132620" className="hover:text-green-400 transition-colors font-medium">
                    {t('footer.contact.phone.value')}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center group">
                <div className="bg-purple-500/20 p-2 rounded-lg mr-3 group-hover:bg-purple-500/30 transition-colors">
                  <MapPin size={16} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{t('footer.contact.location.label')}</p>
                  <p className="text-purple-400 font-medium">{t('footer.contact.location.value')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {t('footer.legal.copyright')}
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              {t('footer.legal.links', {}, '').map((link: any, index: number) => (
                <Link 
                  key={index} 
                  to={`/${currentLanguage.code}${link.href}`} 
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center">
                <span>{t('footer.legal.madeWith')}</span>
                <Heart className="mx-1 text-red-400 animate-pulse" size={14} />
                <span>{t('footer.legal.madeIn')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;