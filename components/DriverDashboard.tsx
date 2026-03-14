import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../types';
import { Bike, MapPin, CheckCircle, Navigation, Phone, Clock, DollarSign, History } from 'lucide-react';

interface DriverDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ orders, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'earnings'>('current');

  // Drivers see 'ready' orders that are for delivery, and their own 'out_for_delivery'
  const activeDeliveries = orders.filter(o => 
    (o.status === 'ready' && o.type === 'delivery') || 
    (o.status === 'out_for_delivery')
  );

  const completedDeliveries = orders.filter(o => o.status === 'delivered' && o.type === 'delivery');
  
  // Fake earnings calculation logic: Base R25 per delivery
  const totalEarnings = completedDeliveries.length * 25;

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 px-4 pb-20 text-white font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
            <Bike className="w-8 h-8 text-green-500" /> Driver App
          </h2>
          <p className="text-gray-400 text-sm mt-1">
             {activeTab === 'current' ? `${activeDeliveries.length} Available Jobs` : 
              activeTab === 'history' ? `${completedDeliveries.length} Past Trips` : 
              `Today's Earnings`}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black font-bold border-2 border-white/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            JD
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-zinc-900 p-1 rounded-xl mb-6">
          <button 
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'current' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
              Active
          </button>
          <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
              History
          </button>
          <button 
              onClick={() => setActiveTab('earnings')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'earnings' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
              Earnings
          </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
            {activeTab === 'current' && (
                <motion.div 
                    key="current"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                >
                    {activeDeliveries.length === 0 ? (
                        <div className="py-20 text-center opacity-50">
                            <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-600 animate-pulse" />
                            <h3 className="text-xl font-bold">No Deliveries Available</h3>
                            <p className="text-sm">Wait for the kitchen to mark orders as ready.</p>
                        </div>
                    ) : (
                        activeDeliveries.map((order) => {
                            const isPickedUp = order.status === 'out_for_delivery';
                            return (
                                <motion.div
                                    key={order.id}
                                    layout
                                    className={`rounded-2xl overflow-hidden border ${isPickedUp ? 'bg-zinc-800 border-green-500/50' : 'bg-zinc-900 border-white/10'}`}
                                >
                                    {/* Status Banner */}
                                    <div className={`py-2 px-4 text-xs font-bold uppercase tracking-widest flex justify-between ${isPickedUp ? 'bg-green-500 text-black' : 'bg-zinc-800 text-gray-400'}`}>
                                        <span>{isPickedUp ? 'In Transit' : 'Ready for Pickup'}</span>
                                        <span>#{order.id.slice(-4)}</span>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black">{order.customerName}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#E4002B] font-bold text-xl">R {order.total}</p>
                                                <p className="text-xs text-gray-500">{order.items.length} Items</p>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="space-y-4 relative pl-4 mb-6">
                                            <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-gray-700"></div>
                                            
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#E4002B] ring-4 ring-zinc-900"></div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase">Pickup</h4>
                                                <p className="font-bold text-sm">{order.branchName}</p>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-zinc-900"></div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase">Dropoff</h4>
                                                <p className="font-bold text-sm">Customer Location (GPS)</p>
                                                <p className="text-xs text-gray-400 mt-1">2.4 km • 8 mins</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {isPickedUp && (
                                                <a 
                                                    href={`tel:0722625940`} // Simplified for demo
                                                    className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                                                >
                                                    <Phone className="w-4 h-4" /> Call
                                                </a>
                                            )}
                                            {isPickedUp && (
                                                <a 
                                                    href="https://www.google.com/maps"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="py-3 rounded-xl bg-blue-600/20 text-blue-500 hover:bg-blue-600/30 font-bold text-sm flex items-center justify-center gap-2"
                                                >
                                                    <Navigation className="w-4 h-4" /> Maps
                                                </a>
                                            )}
                                            
                                            {isPickedUp ? (
                                                <button 
                                                    onClick={() => onUpdateStatus(order.id, 'delivered')}
                                                    className="col-span-2 py-3 rounded-xl bg-green-500 text-black hover:bg-green-400 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Complete Delivery
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                                                    className="col-span-2 py-3 rounded-xl bg-[#E4002B] text-white hover:bg-red-600 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                                                >
                                                    <Bike className="w-4 h-4" /> Accept Job
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </motion.div>
            )}

            {activeTab === 'history' && (
                <motion.div 
                    key="history"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                >
                     {completedDeliveries.length === 0 ? (
                        <div className="py-20 text-center opacity-50">
                            <History className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p className="text-sm">No completed trips yet.</p>
                        </div>
                     ) : (
                         completedDeliveries.map(order => (
                             <div key={order.id} className="bg-zinc-900 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                                 <div>
                                     <div className="text-xs text-gray-500 mb-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                     <div className="font-bold text-white">{order.customerName}</div>
                                     <div className="text-xs text-gray-400">{order.branchName}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-green-500 font-bold">+ R25.00</div>
                                     <div className="text-xs text-gray-500">Earned</div>
                                 </div>
                             </div>
                         ))
                     )}
                </motion.div>
            )}

            {activeTab === 'earnings' && (
                <motion.div 
                    key="earnings"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6 text-center pt-10"
                >
                    <div className="w-32 h-32 mx-auto rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                        <DollarSign className="w-16 h-16 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-white mb-2">R {totalEarnings.toFixed(2)}</h2>
                        <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Total Earnings</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-zinc-900 p-4 rounded-xl">
                            <h4 className="text-2xl font-bold text-white">{completedDeliveries.length}</h4>
                            <p className="text-xs text-gray-500 uppercase">Trips Completed</p>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded-xl">
                            <h4 className="text-2xl font-bold text-white">4.8</h4>
                            <p className="text-xs text-gray-500 uppercase">Rating</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DriverDashboard;