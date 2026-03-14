import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, MessageCircle, Plus, Minus, ShoppingBag, ArrowRight, Bike, Package } from 'lucide-react';
import { MenuItem, Branch, CartItem, OrderType } from '../types';
import { CONTACT_INFO } from '../constants';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: MenuItem | null;
  branches: Branch[];
  onAddToCart: (item: CartItem) => void;
  activeBranch?: Branch | null;
  onOrderPlaced: (type: OrderType, total: number) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, selectedItem, branches, onAddToCart, activeBranch, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'details' | 'branch'>('details');
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNotes('');
      setStep('details');
      setOrderType('delivery');
    }
  }, [isOpen, selectedItem]);

  if (!isOpen || !selectedItem) return null;

  const handleBranchSelect = (branch: Branch) => {
    let phone = CONTACT_INFO.whatsapp.replace(/\s+/g, '');
    if (phone.startsWith('0')) {
        phone = '27' + phone.substring(1);
    }

    const message = `Hi Login Cafe! 🍔 I would like to order (${orderType.toUpperCase()}):
*${quantity}x ${selectedItem.name}* (${selectedItem.code})
${notes ? `Note: ${notes}` : ''}
Price: R${selectedItem.price * quantity}

I will be ordering from/to:
📍 *${branch.name}*
${branch.address}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Complete the flow
    onOrderPlaced(orderType, selectedItem.price * quantity);
  };

  const handleQuickOrderClick = () => {
    setStep('branch');
  };

  const handleAddToCart = () => {
    onAddToCart({
        ...selectedItem,
        quantity,
        notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
                {/* Background glow effects (Dark mode only) */}
                <div className="hidden dark:block absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-1">
                                {step === 'details' ? 'Customize Order' : 'Select Branch'}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {step === 'details' ? 'Adjust quantity and add notes' : 'Where are you ordering from?'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-6 border border-gray-100 dark:border-white/10 flex gap-4 items-center">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-600/20 rounded-lg flex items-center justify-center text-red-600 dark:text-red-500 font-bold border border-red-200 dark:border-red-500/30 shrink-0">
                            {selectedItem.code.split('-')[0]}
                        </div>
                        <div>
                            <h4 className="font-bold dark:text-white text-gray-900 leading-tight">{selectedItem.name}</h4>
                            <p className="text-[#E4002B] font-semibold mt-1">R {selectedItem.price * quantity}</p>
                        </div>
                    </div>

                    {step === 'details' ? (
                        <div className="space-y-6">
                            {/* Quantity */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-black dark:text-white"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="text-xl font-black w-8 text-center dark:text-white text-black">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/20 transition-colors text-black dark:text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Special Instructions</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="No onions, extra sauce, etc..."
                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:border-[#E4002B] outline-none dark:text-white text-gray-900 transition-colors h-24 resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="py-3 px-4 rounded-xl font-bold border-2 border-gray-200 dark:border-white/20 hover:border-[#E4002B] dark:hover:border-[#E4002B] text-gray-700 dark:text-white transition-all flex items-center justify-center gap-2 group"
                                >
                                    <ShoppingBag className="w-4 h-4 group-hover:text-[#E4002B]" /> Add to Bag
                                </button>
                                <button
                                    onClick={handleQuickOrderClick}
                                    className="py-3 px-4 rounded-xl font-bold bg-[#E4002B] text-white hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-red-600/20 text-sm md:text-base"
                                >
                                    Quick Order <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                             {/* Order Type Toggle */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button 
                                    onClick={() => setOrderType('delivery')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${orderType === 'delivery' ? 'border-[#E4002B] bg-[#E4002B]/10 text-[#E4002B]' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                                >
                                    <Bike className="w-6 h-6" />
                                    <span className="font-bold text-xs">Delivery</span>
                                </button>
                                <button 
                                    onClick={() => setOrderType('pickup')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${orderType === 'pickup' ? 'border-[#E4002B] bg-[#E4002B]/10 text-[#E4002B]' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                                >
                                    <Package className="w-6 h-6" />
                                    <span className="font-bold text-xs">Collect</span>
                                </button>
                            </div>

                             {branches.map((branch, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleBranchSelect(branch)}
                                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left group flex items-start gap-3 ${
                                        activeBranch?.name === branch.name 
                                        ? 'bg-[#E4002B]/10 border-[#E4002B] dark:border-[#E4002B]' 
                                        : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-[#E4002B]'
                                    }`}
                                >
                                    <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 transition-colors ${activeBranch?.name === branch.name ? 'text-[#E4002B]' : 'text-gray-400 group-hover:text-red-500'}`} />
                                    <div>
                                        <h5 className={`font-bold transition-colors ${activeBranch?.name === branch.name ? 'text-[#E4002B]' : 'text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>{branch.name}</h5>
                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{branch.address}</p>
                                    </div>
                                    <MessageCircle className="w-5 h-5 text-green-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                                </button>
                            ))}
                            <button onClick={() => setStep('details')} className="w-full text-center text-sm font-bold text-gray-500 mt-2 hover:text-[#E4002B]">
                                Back to details
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
  );
};

export default OrderModal;