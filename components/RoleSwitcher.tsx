import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ChefHat, LayoutDashboard, Bike, Shield } from 'lucide-react';
import { UserRole } from '../types';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onSwitch: (role: UserRole) => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'customer', label: 'Customer', icon: User, color: 'bg-blue-500' },
    { id: 'kitchen', label: 'Kitchen', icon: ChefHat, color: 'bg-orange-500' },
    { id: 'driver', label: 'Driver', icon: Bike, color: 'bg-green-500' },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="mb-4 flex flex-col gap-2"
          >
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  onSwitch(role.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-lg backdrop-blur-md border border-white/10 transition-transform hover:scale-105 ${
                  currentRole === role.id ? 'bg-white text-black' : 'bg-black/80 text-white'
                }`}
              >
                <div className={`p-1.5 rounded-full ${role.color} text-white`}>
                  <role.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{role.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-zinc-900 border border-white/20 rounded-full shadow-2xl hover:bg-white hover:text-black transition-all duration-300"
      >
        <Shield className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </button>
    </div>
  );
};

export default RoleSwitcher;