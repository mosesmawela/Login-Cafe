import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight, Smartphone, Mail, ShieldCheck } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [identifier, setIdentifier] = useState(''); // Phone or Email
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier && name) {
      setStep('otp');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification
    if (otp.length === 4) {
      const newUser: UserType = {
        id: `USER-${Date.now()}`,
        name: name,
        phone: method === 'phone' ? identifier : undefined,
        email: method === 'email' ? identifier : undefined,
        points: 50, // Welcome bonus
        role: 'customer',
        savedAddresses: [],
        savedCards: [],
        orderHistory: [],
        preferences: {},
        favorites: []
      };
      onLogin(newUser);
      onClose();
    }
  };

  const handleGuest = () => {
      // Create a temporary guest session
      const guestUser: UserType = {
        id: `GUEST-${Date.now()}`,
        name: 'Guest User',
        points: 0,
        role: 'customer',
        savedAddresses: [],
        savedCards: [],
        orderHistory: [],
        preferences: {},
        favorites: []
      };
      onLogin(guestUser);
      onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black uppercase text-white">
                {step === 'input' ? 'Sign In' : 'Verify'}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 'input' ? (
              <>
                {/* Method Tabs */}
                <div className="flex bg-black/50 p-1 rounded-lg mb-6">
                    <button 
                        onClick={() => setMethod('phone')}
                        className={`flex-1 py-2 rounded-md text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${method === 'phone' ? 'bg-[#E4002B] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Smartphone className="w-4 h-4" /> Phone
                    </button>
                    <button 
                         onClick={() => setMethod('email')}
                         className={`flex-1 py-2 rounded-md text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${method === 'email' ? 'bg-[#E4002B] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Mail className="w-4 h-4" /> Email
                    </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <div className="flex items-center bg-black/50 border border-white/10 rounded-lg px-3 py-3 focus-within:border-[#E4002B] transition-colors">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-medium"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{method === 'phone' ? 'Mobile Number' : 'Email Address'}</label>
                    <div className="flex items-center bg-black/50 border border-white/10 rounded-lg px-3 py-3 focus-within:border-[#E4002B] transition-colors">
                        {method === 'phone' ? (
                            <span className="text-gray-400 mr-3 font-bold">+27</span>
                        ) : (
                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <input
                        required
                        type={method === 'phone' ? 'tel' : 'email'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={method === 'phone' ? '82 123 4567' : 'name@example.com'}
                        className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-medium"
                        />
                    </div>
                    </div>

                    <button
                    type="submit"
                    className="w-full bg-[#E4002B] text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-red-600 transition-all flex justify-center items-center gap-2 mt-4"
                    >
                        Send Code <ArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <button onClick={handleGuest} className="text-sm font-bold text-gray-400 hover:text-white underline">
                        Continue as Guest
                    </button>
                </div>
              </>
          ) : (
              <form onSubmit={handleVerify} className="space-y-6">
                   <div className="text-center">
                       <ShieldCheck className="w-12 h-12 text-[#E4002B] mx-auto mb-4" />
                       <p className="text-sm text-gray-400">Enter the 4-digit code sent to <span className="text-white font-bold">{identifier}</span></p>
                   </div>

                   <div className="flex justify-center gap-4">
                       <input 
                            type="text" 
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-40 text-center text-3xl font-black bg-black/50 border border-white/10 rounded-xl py-4 focus:border-[#E4002B] outline-none text-white tracking-[1em]"
                            autoFocus
                        />
                   </div>

                    <button
                        type="submit"
                        className="w-full bg-[#E4002B] text-white py-3 rounded-lg font-black uppercase tracking-wider hover:bg-red-600 transition-all flex justify-center items-center gap-2"
                    >
                        Verify & Login
                    </button>
                    
                    <button type="button" onClick={() => setStep('input')} className="w-full text-center text-xs text-gray-500 font-bold uppercase hover:text-white">
                        Back
                    </button>
              </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;