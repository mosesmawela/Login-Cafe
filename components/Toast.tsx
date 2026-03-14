import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const Toast: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            className={`pointer-events-auto min-w-[300px] p-4 rounded-lg shadow-2xl border flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-green-900/90 border-green-700 text-white' 
                : toast.type === 'error'
                ? 'bg-red-900/90 border-red-700 text-white'
                : 'bg-blue-900/90 border-blue-700 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;