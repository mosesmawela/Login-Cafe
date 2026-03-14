import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Tag, FileText } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  type: 'policy' | 'promo' | 'info';
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, content, type }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${type === 'promo' ? 'bg-red-100 text-[#E4002B]' : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'}`}>
                    {type === 'promo' && <Tag className="w-5 h-5" />}
                    {type === 'policy' && <ShieldCheck className="w-5 h-5" />}
                    {type === 'info' && <FileText className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-black uppercase dark:text-white text-gray-900">{title}</h3>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors dark:text-gray-400 dark:hover:text-white text-gray-500">
                <X className="w-6 h-6" />
             </button>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {typeof content === 'string' ? <p className="whitespace-pre-wrap">{content}</p> : content}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg font-bold text-gray-700 dark:text-white transition-colors"
             >
                Close
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoModal;