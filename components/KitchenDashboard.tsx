import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../types';
import { ChefHat, Clock, CheckCircle, Flame, XCircle, RotateCcw, History, AlertTriangle, Printer, Pause, Play, AlertCircle, Pin, QrCode } from 'lucide-react';

interface KitchenDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

const CookingTimer: React.FC<{ start: number, status: string }> = ({ start, status }) => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!start || status !== 'cooking') return;
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - start) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [start, status]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`font-mono text-xl font-bold ${elapsed > 600 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {status === 'paused' ? 'PAUSED' : formatTime(elapsed)}
        </div>
    );
};

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ orders, onUpdateStatus, onUpdateOrder }) => {
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live');
  const [rejectionModal, setRejectionModal] = useState<string | null>(null); // orderId
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // For details/QR modal

  const activeOrders = orders.filter(o => ['accepted', 'preparing', 'ready'].includes(o.status));
  const historyOrders = orders.filter(o => ['completed', 'delivered', 'cancelled'].includes(o.status));

  // Sort: Priority first, then oldest
  const sortedActiveOrders = [...activeOrders].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.createdAt - b.createdAt;
  });

  const handleStartCooking = (order: Order) => {
      onUpdateStatus(order.id, 'preparing');
      onUpdateOrder(order.id, { cookingStart: Date.now(), cookingStatus: 'cooking' });
  };

  const handleTogglePause = (order: Order) => {
      if (order.cookingStatus === 'cooking') {
          onUpdateOrder(order.id, { cookingStatus: 'paused' });
      } else if (order.cookingStatus === 'paused') {
          onUpdateOrder(order.id, { cookingStatus: 'cooking' });
      }
  };

  const handleReject = (orderId: string, reason: string) => {
      onUpdateStatus(orderId, 'cancelled');
      onUpdateOrder(orderId, { rejectionReason: reason });
      setRejectionModal(null);
  };

  const handleToggleIssue = (order: Order) => {
      if (order.issue) {
          onUpdateOrder(order.id, { issue: undefined });
      } else {
          onUpdateOrder(order.id, { issue: 'Issue Flagged' });
      }
  };

  const handleTogglePriority = (order: Order) => {
      onUpdateOrder(order.id, { isPriority: !order.isPriority });
  };

  const getAllergens = (itemName: string) => {
      // Mock allergen detection
      const allergens = [];
      const lower = itemName.toLowerCase();
      if (lower.includes('cheese') || lower.includes('milk')) allergens.push('Dairy');
      if (lower.includes('egg')) allergens.push('Egg');
      if (lower.includes('fish') || lower.includes('hake')) allergens.push('Seafood');
      if (lower.includes('bread') || lower.includes('kota')) allergens.push('Gluten');
      return allergens;
  };

  const columns = [
      { id: 'accepted', label: 'Incoming', icon: Clock, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
      { id: 'preparing', label: 'Cooking', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
      { id: 'ready', label: 'Ready', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 px-4 pb-10 text-white font-sans overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-[#E4002B]" /> KDS
          </h2>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/10">
                <button 
                    onClick={() => setActiveTab('live')}
                    className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'live' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Live
                </button>
                 <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeTab === 'history' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    History
                </button>
            </div>
        </div>
      </div>

      {activeTab === 'live' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
              {columns.map(col => (
                  <div key={col.id} className="flex flex-col h-full bg-zinc-900/50 rounded-xl border border-white/5 backdrop-blur-sm overflow-hidden">
                      {/* Column Header */}
                      <div className={`p-3 border-b flex justify-between items-center ${col.bg}`}>
                          <h3 className={`font-black uppercase tracking-wider flex items-center gap-2 ${col.color}`}>
                              <col.icon className="w-5 h-5" /> {col.label}
                          </h3>
                          <span className="bg-black/40 text-white px-2 py-0.5 rounded text-xs font-bold">
                              {sortedActiveOrders.filter(o => o.status === col.id).length}
                          </span>
                      </div>
                      
                      {/* Orders List */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                          <AnimatePresence>
                            {sortedActiveOrders.filter(o => o.status === col.id).map(order => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`relative p-4 rounded-lg border-2 shadow-lg bg-zinc-800 ${
                                        order.issue ? 'border-yellow-500 animate-pulse' :
                                        order.isPriority ? 'border-purple-500' : 
                                        'border-zinc-700'
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black">#{order.id.slice(-4)}</span>
                                                {order.isPriority && <Pin className="w-4 h-4 text-purple-500 fill-purple-500" />}
                                                {order.issue && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                            </div>
                                            <p className="text-sm font-bold text-gray-300 truncate max-w-[150px]">{order.customerName}</p>
                                        </div>
                                        <div className="text-right">
                                            {order.status === 'preparing' ? (
                                                <CookingTimer start={order.cookingStart || 0} status={order.cookingStatus || 'cooking'} />
                                            ) : (
                                                <span className="text-xs text-gray-500 font-mono">
                                                    {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, idx) => {
                                            const allergens = getAllergens(item.name);
                                            return (
                                                <div key={idx} className="bg-black/30 p-2 rounded border border-white/5">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold text-white text-lg leading-none">{item.quantity}x <span className="text-base font-normal text-gray-300">{item.name}</span></span>
                                                    </div>
                                                    {item.notes && (
                                                        <p className="text-yellow-400 text-xs italic mt-1 bg-yellow-900/20 px-1 rounded inline-block">"{item.notes}"</p>
                                                    )}
                                                    {allergens.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {allergens.map(a => (
                                                                <span key={a} className="text-[10px] bg-red-900/40 text-red-300 px-1 rounded border border-red-900/50 uppercase font-bold">{a}</span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Actions */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {/* Common Actions */}
                                        <button onClick={() => setSelectedOrder(order)} className="col-span-1 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center justify-center py-2" title="Details">
                                            <Printer className="w-4 h-4 text-gray-300" />
                                        </button>

                                        {/* Status Specific Actions */}
                                        {order.status === 'accepted' && (
                                            <>
                                                <button onClick={() => setRejectionModal(order.id)} className="col-span-1 bg-zinc-700 hover:bg-red-900 rounded flex items-center justify-center py-2 text-red-400">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleStartCooking(order)} className="col-span-2 bg-orange-600 hover:bg-orange-500 rounded flex items-center justify-center py-2 font-bold uppercase text-xs">
                                                    Start
                                                </button>
                                            </>
                                        )}

                                        {order.status === 'preparing' && (
                                            <>
                                                <button onClick={() => handleTogglePause(order)} className="col-span-1 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center justify-center py-2">
                                                    {order.cookingStatus === 'paused' ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-yellow-400" />}
                                                </button>
                                                <button onClick={() => onUpdateStatus(order.id, 'ready')} className="col-span-2 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center py-2 font-bold uppercase text-xs">
                                                    Ready
                                                </button>
                                            </>
                                        )}

                                        {order.status === 'ready' && (
                                            <>
                                                <button onClick={() => onUpdateStatus(order.id, 'preparing')} className="col-span-1 bg-zinc-700 hover:bg-zinc-600 rounded flex items-center justify-center py-2 text-gray-400">
                                                    <RotateCcw className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => onUpdateStatus(order.id, 'completed')} className="col-span-2 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center py-2 font-bold uppercase text-xs">
                                                    Complete
                                                </button>
                                            </>
                                        )}

                                        {/* Quick Toggles */}
                                        {order.status === 'preparing' && (
                                            <div className="col-span-4 flex gap-2 mt-2 pt-2 border-t border-white/5">
                                                <button onClick={() => handleTogglePriority(order)} className={`flex-1 py-1 rounded text-[10px] font-bold uppercase ${order.isPriority ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-700 text-gray-400'}`}>
                                                    Priority
                                                </button>
                                                <button onClick={() => handleToggleIssue(order)} className={`flex-1 py-1 rounded text-[10px] font-bold uppercase ${order.issue ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zinc-700 text-gray-400'}`}>
                                                    Flag Issue
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                          </AnimatePresence>
                      </div>
                  </div>
              ))}
          </div>
      ) : (
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
               <div className="overflow-x-auto">
                   <table className="w-full text-left">
                       <thead className="bg-black/50 text-gray-400 text-xs font-bold uppercase">
                           <tr>
                               <th className="p-4">Time</th>
                               <th className="p-4">ID</th>
                               <th className="p-4">Customer</th>
                               <th className="p-4">Reason/Status</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                            {historyOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</td>
                                    <td className="p-4 text-sm font-mono text-gray-400">#{order.id.slice(-4)}</td>
                                    <td className="p-4 font-bold">{order.customerName}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                                        }`}>
                                            {order.status === 'cancelled' && order.rejectionReason ? `Rejected: ${order.rejectionReason}` : order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                       </tbody>
                   </table>
               </div>
          </div>
      )}

      {/* Rejection Modal */}
      {rejectionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-sm">
                  <h3 className="text-xl font-bold text-white mb-4">Reject Order</h3>
                  <div className="space-y-2">
                      {['Out of Stock', 'Kitchen Too Busy', 'Closing Soon', 'Invalid Order'].map(reason => (
                          <button key={reason} onClick={() => handleReject(rejectionModal, reason)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left px-4 font-bold text-sm">
                              {reason}
                          </button>
                      ))}
                      <button onClick={() => setRejectionModal(null)} className="w-full py-3 mt-4 text-gray-500 hover:text-white">Cancel</button>
                  </div>
              </div>
          </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-white text-black rounded-xl p-8 w-full max-w-md shadow-2xl relative">
                  <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><XCircle className="w-6 h-6" /></button>
                  <div className="text-center border-b border-dashed border-gray-300 pb-6 mb-6">
                      <h2 className="text-2xl font-black uppercase tracking-widest">Login Cafe</h2>
                      <p className="text-xs text-gray-500">Order #{selectedOrder.id}</p>
                      <p className="text-sm font-bold mt-2">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-4 mb-6">
                      {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                              <span className="font-bold">{item.quantity} x {item.name}</span>
                              <span>R {item.price * item.quantity}</span>
                          </div>
                      ))}
                      <div className="flex justify-between border-t border-gray-200 pt-4 font-black text-xl">
                          <span>Total</span>
                          <span>R {selectedOrder.total}</span>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <button className="py-3 bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Print</button>
                      <button className="py-3 bg-gray-200 text-black rounded-lg font-bold flex items-center justify-center gap-2"><QrCode className="w-4 h-4" /> QR Code</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default KitchenDashboard;