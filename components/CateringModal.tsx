import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, MessageSquare, Send } from 'lucide-react';
import { CateringFormData } from '../types';
import { CONTACT_INFO } from '../constants';

interface CateringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CateringModal: React.FC<CateringModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<CateringFormData>({
    name: '',
    phone: '',
    date: '',
    guests: 10,
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const message = `*Catering Inquiry* 🍽️
    
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Date:* ${formData.date}
*Guests:* ${formData.guests}

*Details:*
${formData.details}`;

    let phone = CONTACT_INFO.whatsapp.replace(/\s+/g, '');
    if (phone.startsWith('0')) {
        phone = '27' + phone.substring(1);
    }

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                 <h3 className="text-2xl font-black uppercase dark:text-white text-gray-900">Catering Inquiry</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Let us handle the food for your next big event.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors dark:text-gray-400 dark:hover:text-white text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-[#E4002B] dark:text-white"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                    <input
                      required
                      type="tel"
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-[#E4002B] dark:text-white"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</label>
                    <input
                      required
                      type="date"
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-[#E4002B] dark:text-white"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2"><Users className="w-3 h-3" /> Approx Guests</label>
                    <input
                      required
                      type="number"
                      min="10"
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-[#E4002B] dark:text-white"
                      value={formData.guests}
                      onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                    />
                  </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-2"><MessageSquare className="w-3 h-3" /> Event Details / Menu Requirements</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 outline-none focus:border-[#E4002B] dark:text-white resize-none"
                  placeholder="Tell us about the event type, food preferences, allergies..."
                  value={formData.details}
                  onChange={e => setFormData({...formData, details: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E4002B] text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-red-600/20"
              >
                Send Inquiry via WhatsApp <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CateringModal;