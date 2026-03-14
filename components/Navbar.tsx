import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, User, ShoppingBag, Sun, Moon, Cloud, LogIn, Utensils, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, User as UserType, Branch } from '../types';

interface NavbarProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
  onOpenCatering: () => void;
  onSetLocation: () => void;
  onOpenPromo: () => void;
  user: UserType | null;
  activeBranch: Branch | null;
  isLocating: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
    theme, 
    onThemeChange, 
    cartCount, 
    onOpenCart, 
    onOpenLogin,
    onOpenProfile,
    onOpenCatering,
    onSetLocation,
    onOpenPromo,
    user,
    activeBranch,
    isLocating
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsOpen(false);
  };

  const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
        const headerOffset = 120; // Adjusted for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
  };

  const navLinks = [
    { name: 'Menu', href: '#menu', action: undefined },
    { name: 'Locations', href: '#locations', action: undefined },
    { name: 'Promos', href: '#', action: onOpenPromo },
    { name: 'Catering', href: '#', action: onOpenCatering },
  ];

  const getNavClasses = () => {
    const base = "fixed top-[41px] left-0 right-0 z-50 transition-all duration-500 py-3 ";
    if (scrolled || isOpen) {
        if (theme === 'dark') return base + "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl";
        if (theme === 'grey') return base + "bg-zinc-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl";
        return base + "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-xl";
    }
    return base + "bg-transparent backdrop-blur-sm";
  };

  const getTextColor = () => {
    if (theme === 'light') return 'text-gray-900';
    return 'text-white';
  };

  return (
    <>
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-[60] py-2 px-4 flex justify-between md:justify-center items-center text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
          theme === 'light' ? 'bg-white border-b border-gray-100 text-gray-800' : 
          theme === 'grey' ? 'bg-zinc-900 border-b border-white/5 text-gray-400' :
          'bg-black border-b border-white/10 text-gray-400'
      }`}>
        <div className="flex items-center">
            <MapPin className="w-3 h-3 text-[#E4002B] mr-2 animate-bounce" />
            <span className="mr-4 hidden md:inline">Township Flavour, World Class Vibe</span>
            <span className="mr-2 md:hidden truncate max-w-[150px]">{activeBranch ? activeBranch.name : 'Find nearest store'}</span>
        </div>
        <button 
            onClick={onSetLocation}
            disabled={isLocating}
            className={`rounded-full px-3 py-0.5 transition-all flex items-center gap-2 hover:scale-105 ${
                theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-black' : 
                'bg-white/10 hover:bg-white/20 text-white'
            }`}
        >
          {isLocating ? (
              <span className="animate-pulse">Locating...</span>
          ) : activeBranch ? (
              <span className="text-[#E4002B] font-black">{activeBranch.name.replace('Login Cafe @ ', '')}</span>
          ) : (
              'Set Location'
          )}
        </button>
      </motion.div>

      <nav className={getNavClasses()}>
        <div className="container mx-auto px-6 flex items-center justify-between h-14">
          <a href="#" onClick={handleLogoClick} className="flex items-center gap-1 group relative z-10">
            <span className={`text-2xl md:text-3xl font-black tracking-tighter italic ${getTextColor()}`}>
              LOGIN<span className="text-[#E4002B] group-hover:text-white transition-colors">CAFE</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 bg-black/5 dark:bg-white/5 px-6 py-2 rounded-full border border-black/5 dark:border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                    if (link.action) {
                        e.preventDefault();
                        link.action();
                    } else {
                        handleSmoothScroll(e, link.href);
                    }
                }}
                className={`text-xs font-bold uppercase tracking-widest hover:text-[#E4002B] transition-colors cursor-pointer ${getTextColor()}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className={`flex items-center p-1 rounded-full border ${
                theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-white/5 border-white/10'
            }`}>
                <button 
                    onClick={() => onThemeChange('light')}
                    className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-yellow-500 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
                ><Sun className="w-3.5 h-3.5" /></button>
                <button 
                    onClick={() => onThemeChange('grey')}
                    className={`p-1.5 rounded-full transition-all ${theme === 'grey' ? 'bg-zinc-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
                ><Cloud className="w-3.5 h-3.5" /></button>
                <button 
                    onClick={() => onThemeChange('dark')}
                    className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-gray-800 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
                ><Moon className="w-3.5 h-3.5" /></button>
            </div>

            {user ? (
                <button 
                  onClick={onOpenProfile}
                  className={`flex items-center gap-2 text-sm font-bold ${getTextColor()} hover:scale-105 transition-transform`}
                >
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-[10px] text-[#E4002B] uppercase">Member</span>
                        <span>{user.name.split(' ')[0]}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E4002B] to-black flex items-center justify-center text-white border border-white/10 shadow-lg shadow-red-900/20">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                </button>
            ) : (
                <button onClick={onOpenLogin} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-[#E4002B] transition-colors ${getTextColor()}`}>
                    <User className="w-4 h-4" /> Sign In
                </button>
            )}

            <button onClick={onOpenCart} className="relative group" title="View Cart">
                <ShoppingBag className={`w-6 h-6 ${getTextColor()} group-hover:text-[#E4002B] transition-colors`} />
                {cartCount > 0 && (
                     <span className="absolute -top-2 -right-2 bg-[#E4002B] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                        {cartCount}
                    </span>
                )}
            </button>
            
            <button
              onClick={(e) => handleSmoothScroll(e, '#menu')}
              className="px-6 py-2.5 rounded-full bg-[#E4002B] text-white font-black text-xs uppercase tracking-widest hover:bg-[#c40026] transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(228,0,43,0.3)] hover:shadow-[0_0_30px_rgba(228,0,43,0.5)]"
            >
              Order Now
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors z-20 ${
                theme === 'light' ? 'text-black hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden fixed inset-0 top-[41px] z-10 flex flex-col pt-20 px-6 ${
                theme === 'light' ? 'bg-white/95 backdrop-blur-xl' : 'bg-black/95 backdrop-blur-xl'
            }`}
          >
            <div className="flex flex-col gap-6">
               {user && (
                   <button 
                     onClick={() => { onOpenProfile(); setIsOpen(false); }}
                     className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#E4002B] to-orange-600 text-white shadow-lg text-left"
                   >
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border border-white/30">
                             {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                             <p className="font-bold text-lg">{user.name}</p>
                             <div className="flex items-center gap-1 text-xs opacity-90 font-medium">
                                <Star className="w-3 h-3 fill-white" /> {user.points} Pts
                             </div>
                        </div>
                   </button>
               )}

              <div className="grid grid-cols-2 gap-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                          if (link.action) {
                              e.preventDefault();
                              link.action();
                          } else {
                              handleSmoothScroll(e, link.href);
                          }
                          setIsOpen(false);
                      }}
                      className={`p-4 rounded-xl text-center font-bold uppercase tracking-wider text-sm transition-all ${
                          theme === 'light' 
                          ? 'bg-gray-100 text-gray-800 active:bg-gray-200' 
                          : 'bg-white/10 text-white active:bg-white/20'
                      }`}
                    >
                      {link.name}
                    </a>
                  ))}
              </div>

              {!user && (
                 <button 
                    onClick={() => { onOpenLogin(); setIsOpen(false); }} 
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold uppercase border-2 ${
                        theme === 'light' ? 'border-gray-200 text-black' : 'border-white/20 text-white'
                    }`}
                 >
                    <LogIn className="w-5 h-5" /> Sign In / Register
                 </button>
              )}
              
              <button 
                  onClick={() => { onOpenCart(); setIsOpen(false); }}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                      theme === 'light' ? 'border-gray-200 text-black bg-gray-50' : 'border-white/10 text-white bg-white/5'
                  }`}
              >
                  <span className="font-bold flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> My Bag</span>
                  {cartCount > 0 && <span className="bg-[#E4002B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">{cartCount}</span>}
              </button>

              <button 
                  onClick={(e) => handleSmoothScroll(e, '#menu')}
                  className="w-full py-5 rounded-xl bg-[#E4002B] text-white font-black uppercase tracking-widest text-lg shadow-xl shadow-red-600/20"
              >
                Start Order
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;