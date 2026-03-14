import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, MapPin, ChevronRight, RotateCcw, Bike, Package, Utensils, CreditCard, Tag, Loader2, CheckCircle } from 'lucide-react';
import { CartItem, Branch, OrderType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  branches: Branch[];
  onOrderPlaced: (
      type: OrderType, 
      financials: { subtotal: number; tax: number; deliveryFee: number; discount: number; total: number }
  ) => void;
}

const PROMO_CODES: Record<string, { type: 'percent' | 'fixed', value: number }> = {
    'WELCOME50': { type: 'fixed', value: 50 },
    'LOGIN20': { type: 'percent', value: 20 },
    'MONSTER24': { type: 'fixed', value: 33 } // Free coke approx
};

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemoveItem, onClearCart, branches, onOrderPlaced }) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  
  // Cart Engine State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Reset on open
  useEffect(() => {
      if (isOpen && checkoutStep === 'payment') setCheckoutStep('cart');
  }, [isOpen]);

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% VAT
  const deliveryFee = orderType === 'delivery' ? 25 : 0; // Flat R25
  
  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
      const promo = PROMO_CODES[appliedPromo];
      if (promo.type === 'fixed') discount = promo.value;
      if (promo.type === 'percent') discount = subtotal * (promo.value / 100);
  }
  // Cap discount at subtotal to avoid negative
  discount = Math.min(discount, subtotal);

  const total = subtotal + tax + deliveryFee - discount;

  const handleApplyPromo = () => {
      if (PROMO_CODES[promoCode.toUpperCase()]) {
          setAppliedPromo(promoCode.toUpperCase());
          setPromoCode('');
      } else {
          alert("Invalid Promo Code");
      }
  };

  const handlePayment = () => {
      setIsProcessingPayment(true);
      // Simulate Payment Gateway API
      setTimeout(() => {
          setIsProcessingPayment(false);
          onOrderPlaced(orderType, { subtotal, tax, deliveryFee, discount, total });
          setCheckoutStep('cart'); // Reset for next time
          setAppliedPromo(null);
          setSelectedBranch(null);
      }, 2000);
  };

  const isValidToProceed = () => {
      if (!selectedBranch) return false;
      return true;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[90] flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
              <h2 className="text-xl font-black uppercase dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#E4002B]" /> 
                {checkoutStep === 'cart' ? 'My Bag' : checkoutStep === 'details' ? 'Order Details' : 'Payment'}
              </h2>
              <div className="flex items-center gap-2">
                 {cart.length > 0 && checkoutStep === 'cart' && (
                     <button onClick={onClearCart} title="Clear Cart" className="p-2 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors text-gray-400">
                         <Trash2 className="w-5 h-5" />
                     </button>
                 )}
                 <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white">
                    <X className="w-5 h-5" />
                 </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-white dark:bg-zinc-900 relative">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag className="w-16 h-16 mb-4 dark:text-gray-600 text-gray-300" />
                  <p className="font-bold text-lg dark:text-gray-400 text-gray-500">Your bag is empty</p>
                  <p className="text-sm dark:text-gray-500 text-gray-400">Start adding some delicious food!</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-white/10 flex items-center justify-center font-bold text-gray-400 text-xs shrink-0">
                         {item.code}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold dark:text-white text-gray-900 leading-tight">{item.name}</h4>
                          <button onClick={() => onRemoveItem(idx)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#E4002B] font-bold text-sm">R{item.price * item.quantity}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs font-medium dark:text-gray-400 text-gray-500 bg-white dark:bg-black/30 w-fit px-2 py-1 rounded border dark:border-white/10 border-gray-200">
                          <span>Qty: {item.quantity}</span>
                          {item.notes && <span className="border-l pl-2 dark:border-white/10 border-gray-200 italic max-w-[150px] truncate">{item.notes}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : checkoutStep === 'details' ? (
                <div className="space-y-6">
                   {/* Order Type Toggle */}
                   <div>
                        <h3 className="font-bold dark:text-white text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Type</h3>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setOrderType('delivery')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${orderType === 'delivery' ? 'border-[#E4002B] bg-[#E4002B]/10 text-[#E4002B]' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                            >
                                <Bike className="w-5 h-5" />
                                <span className="font-bold text-[10px] uppercase">Delivery</span>
                            </button>
                            <button 
                                onClick={() => setOrderType('pickup')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${orderType === 'pickup' ? 'border-[#E4002B] bg-[#E4002B]/10 text-[#E4002B]' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                            >
                                <Package className="w-5 h-5" />
                                <span className="font-bold text-[10px] uppercase">Collect</span>
                            </button>
                            <button 
                                onClick={() => setOrderType('dine_in')}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${orderType === 'dine_in' ? 'border-[#E4002B] bg-[#E4002B]/10 text-[#E4002B]' : 'border-gray-200 dark:border-white/10 text-gray-500'}`}
                            >
                                <Utensils className="w-5 h-5" />
                                <span className="font-bold text-[10px] uppercase">Dine In</span>
                            </button>
                        </div>
                   </div>

                  <div>
                    <h3 className="font-bold dark:text-white text-gray-900 mb-3 text-sm uppercase tracking-wider">Select Branch</h3>
                    <div className="space-y-2">
                        {branches.map((branch, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedBranch(branch)}
                                className={`w-full p-4 rounded-xl border transition-all text-left group flex items-start gap-3 ${
                                    selectedBranch?.name === branch.name 
                                    ? 'bg-[#E4002B]/10 border-[#E4002B]' 
                                    : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-[#E4002B]'
                                }`}
                            >
                                <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 transition-colors ${selectedBranch?.name === branch.name ? 'text-[#E4002B]' : 'text-gray-400'}`} />
                                <div>
                                    <h5 className={`font-bold ${selectedBranch?.name === branch.name ? 'text-[#E4002B]' : 'dark:text-gray-200 text-gray-800'}`}>{branch.name}</h5>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{branch.address}</p>
                                </div>
                                {selectedBranch?.name === branch.name && <CheckCircle className="w-5 h-5 ml-auto text-[#E4002B]" />}
                            </button>
                        ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Back to Items
                  </button>
                </div>
              ) : (
                // Payment Step
                <div className="space-y-6">
                    {isProcessingPayment ? (
                        <div className="h-60 flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-12 h-12 text-[#E4002B] animate-spin mb-4" />
                            <h3 className="text-xl font-black dark:text-white">Processing Payment</h3>
                            <p className="text-gray-500 text-sm mt-2">Connecting to secure gateway...</p>
                        </div>
                    ) : (
                        <>
                             {/* Financial Breakdown */}
                             <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold dark:text-white">R {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">VAT (15%)</span>
                                    <span className="font-bold dark:text-white">R {tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="font-bold dark:text-white">{deliveryFee === 0 ? 'Free' : `R ${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-500">
                                        <span className="font-bold flex items-center gap-1"><Tag className="w-3 h-3" /> Discount ({appliedPromo})</span>
                                        <span className="font-bold">- R {discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 dark:border-white/10 pt-3 flex justify-between items-center">
                                    <span className="font-black text-lg dark:text-white">Total</span>
                                    <span className="font-black text-2xl text-[#E4002B]">R {total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Promo Code</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code" 
                                        className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[#E4002B] dark:text-white uppercase font-bold text-sm"
                                    />
                                    <button 
                                        onClick={handleApplyPromo}
                                        className="px-4 bg-black dark:bg-white/10 text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-800"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedPromo && <p className="text-xs text-green-500 mt-2 font-bold">Promo applied successfully!</p>}
                            </div>

                            {/* Payment Method Dummy */}
                            <div>
                                <h3 className="font-bold dark:text-white text-gray-900 mb-3 text-sm uppercase tracking-wider">Payment Method</h3>
                                <div className="flex gap-3 items-center p-3 rounded-xl border border-[#E4002B] bg-[#E4002B]/5">
                                    <CreditCard className="w-6 h-6 text-[#E4002B]" />
                                    <div>
                                        <p className="font-bold text-sm dark:text-white">Visa ending in 4242</p>
                                        <p className="text-xs text-gray-500">Expires 12/25</p>
                                    </div>
                                    <button className="ml-auto text-xs font-bold text-[#E4002B] hover:underline">Change</button>
                                </div>
                            </div>

                            <button 
                                onClick={() => setCheckoutStep('details')}
                                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Back to Details
                            </button>
                        </>
                    )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {cart.length > 0 && !isProcessingPayment && (
              <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                {checkoutStep === 'cart' ? (
                     <button
                        onClick={() => setCheckoutStep('details')}
                        className="w-full py-4 bg-[#E4002B] text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-colors flex justify-center items-center gap-2"
                    >
                        Checkout (R{subtotal}) <ChevronRight className="w-5 h-5" />
                    </button>
                ) : checkoutStep === 'details' ? (
                    <button
                        onClick={() => setCheckoutStep('payment')}
                        disabled={!isValidToProceed()}
                        className="w-full py-4 bg-[#E4002B] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-colors flex justify-center items-center gap-2"
                    >
                        Proceed to Payment <ChevronRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button
                        onClick={handlePayment}
                        className="w-full py-4 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-green-700 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-green-900/20"
                    >
                        Pay R{total.toFixed(2)}
                    </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;