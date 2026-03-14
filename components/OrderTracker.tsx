import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, ChefHat, Bike, MapPin, Package, AlertCircle, CreditCard } from 'lucide-react';
import { OrderType, Branch, OrderStatus, Order } from '../types';

interface OrderTrackerProps {
    isOpen: boolean;
    onClose: () => void;
    activeOrder: Order | null;
    branch?: Branch | null;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ isOpen, onClose, activeOrder, branch }) => {
    
    if (!isOpen || !activeOrder) return null;

    const isDelivery = activeOrder.type === 'delivery';

    // Map order status to progress step index
    const getStatusIndex = (status: OrderStatus) => {
        switch(status) {
            case 'pending_payment': return 0;
            case 'paid': 
            case 'accepted': return 1;
            case 'preparing': return 2;
            case 'ready': return 3;
            case 'out_for_delivery': return 4;
            case 'delivered':
            case 'completed': return 5;
            case 'cancelled': return -1;
            default: return 0;
        }
    };

    const statusIndex = getStatusIndex(activeOrder.status);

    const steps = [
        { label: "Payment", icon: CreditCard, sub: "Processing..." },
        { label: "Accepted", icon: CheckCircle, sub: "Kitchen has your order" },
        { label: "Preparing", icon: ChefHat, sub: "Chefs are cooking" },
        { label: "Ready", icon: Clock, sub: "Quality Checked" },
        { 
            label: isDelivery ? "Out for Delivery" : "Ready for Collection", 
            icon: isDelivery ? Bike : Package, 
            sub: isDelivery ? "Driver is on the way" : "Waiting at counter" 
        },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-end md:items-center justify-center px-4 pb-4 md:pb-0"
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                >
                    {activeOrder.status === 'cancelled' ? (
                        <div className="text-center py-10">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-white uppercase">Order Cancelled</h3>
                            <p className="text-gray-400 mt-2">Please contact the store for more info.</p>
                            <button onClick={onClose} className="mt-6 px-6 py-2 bg-white/10 rounded-full text-white font-bold">Close</button>
                        </div>
                    ) : (
                        <>
                            <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                                <motion.div 
                                    className="h-full bg-[#E4002B]" 
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${Math.min((statusIndex + 1) * 20, 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="flex justify-between items-center mb-8 mt-2">
                                <div>
                                    <h3 className="text-xl font-black uppercase text-white tracking-wider">Order #{activeOrder.id.slice(-4)}</h3>
                                    <p className="text-gray-400 text-sm flex items-center gap-1">
                                        {isDelivery ? <Bike className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                        {activeOrder.type.replace('_', ' ')} • {activeOrder.status === 'completed' ? 'Completed' : 'Live Update'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6 relative">
                                {/* Connecting Line */}
                                <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-800 z-0" />

                                {steps.map((step, idx) => {
                                    const isActive = idx === statusIndex;
                                    const isCompleted = idx < statusIndex;
                                    const Icon = step.icon;
                                    
                                    // Logic to skip steps for Dine In / Pickup if needed, but for simplicity showing full flow
                                    if (activeOrder.status === 'completed' && idx < 4) return null;

                                    return (
                                        <motion.div 
                                            key={idx}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`relative z-10 flex items-center gap-4 ${idx > statusIndex ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                                isActive ? 'bg-[#E4002B] border-[#E4002B] text-white scale-110 shadow-[0_0_15px_rgba(228,0,43,0.5)]' : 
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                                                'bg-gray-800 border-gray-700 text-gray-500'
                                            }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-lg ${isActive ? 'text-[#E4002B]' : 'text-white'}`}>{step.label}</h4>
                                                <p className="text-xs text-gray-400">{step.sub}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {activeOrder.status === 'completed' && (
                                     <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="bg-green-500/20 border border-green-500/50 p-4 rounded-xl text-center"
                                     >
                                         <h4 className="text-green-500 font-black uppercase text-xl mb-1">Order Completed!</h4>
                                         <p className="text-gray-300 text-sm">Enjoy your meal.</p>
                                     </motion.div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                {isDelivery ? (
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                            <Bike className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">
                                                {statusIndex >= 4 ? 'Driver is arriving soon' : 'Searching for driver...'}
                                            </p>
                                            <p className="text-xs text-gray-500">Delivery Partner: KasiD</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{branch ? branch.name : 'Selected Branch'}</p>
                                            <p className="text-xs text-gray-500">{branch ? branch.address : 'Please check your order details'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderTracker;