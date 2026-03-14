import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, MapPin, CreditCard, History, Settings, Star, Heart, Leaf, Flame, Trash2, Plus, Edit2 } from 'lucide-react';
import { User as UserType, Address, PaymentMethod } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUpdateUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wallet' | 'addresses'>('profile');
  
  // Temporary states for forms
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  if (!isOpen) return null;

  const handleAddAddress = () => {
      if (newAddress.label && newAddress.street) {
          const address: Address = {
              id: Date.now().toString(),
              label: newAddress.label || 'Home',
              street: newAddress.street || '',
              city: newAddress.city || 'Tembisa'
          };
          onUpdateUser({
              ...user,
              savedAddresses: [...user.savedAddresses, address]
          });
          setIsAddingAddress(false);
          setNewAddress({});
      }
  };

  const removeAddress = (id: string) => {
      onUpdateUser({
          ...user,
          savedAddresses: user.savedAddresses.filter(a => a.id !== id)
      });
  };

  const togglePreference = (key: keyof typeof user.preferences) => {
      onUpdateUser({
          ...user,
          preferences: {
              ...user.preferences,
              [key]: !user.preferences[key]
          }
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-4xl h-[80vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-black/50 border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E4002B] to-orange-600 flex items-center justify-center text-xl font-bold text-white border-2 border-white/10">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-bold text-white truncate">{user.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {user.points} Pts
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                {[
                    { id: 'profile', label: 'My Profile', icon: User },
                    { id: 'orders', label: 'Order History', icon: History },
                    { id: 'wallet', label: 'Wallet & Cards', icon: CreditCard },
                    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            activeTab === item.id 
                            ? 'bg-[#E4002B] text-white shadow-lg shadow-red-900/20' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-4 h-4" /> {item.label}
                    </button>
                ))}
            </nav>

            <button onClick={onLogout} className="mt-auto w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all text-xs font-bold uppercase tracking-wider">
                Sign Out
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-900 relative">
             <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10">
                <X className="w-5 h-5" />
             </button>

             <div className="p-8 max-w-2xl mx-auto">
                {activeTab === 'profile' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase mb-6">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-white font-medium">
                                        {user.name}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-white font-medium">
                                        {user.phone || 'Not set'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                    <div className="p-3 rounded-lg bg-black/30 border border-white/10 text-white font-medium">
                                        {user.email || 'Not set'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-white uppercase mb-6">Dietary Preferences</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => togglePreference('halal')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${user.preferences.halal ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/30 border-white/10 text-gray-500 hover:border-gray-400'}`}
                                >
                                    <Star className="w-6 h-6" />
                                    <span className="font-bold text-sm">Halal</span>
                                </button>
                                <button 
                                    onClick={() => togglePreference('spicy')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${user.preferences.spicy ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-black/30 border-white/10 text-gray-500 hover:border-gray-400'}`}
                                >
                                    <Flame className="w-6 h-6" />
                                    <span className="font-bold text-sm">Spicy</span>
                                </button>
                                <button 
                                    onClick={() => togglePreference('vegan')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${user.preferences.vegan ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-black/30 border-white/10 text-gray-500 hover:border-gray-400'}`}
                                >
                                    <Leaf className="w-6 h-6" />
                                    <span className="font-bold text-sm">Vegan</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-black text-white uppercase mb-6">Order History</h2>
                        {(!user.orderHistory || user.orderHistory.length === 0) ? (
                            <div className="text-center py-10 opacity-50">
                                <History className="w-12 h-12 mx-auto mb-3" />
                                <p>No orders yet.</p>
                            </div>
                        ) : (
                            user.orderHistory.map((order, idx) => (
                                <div key={idx} className="bg-black/30 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-white">#{order.id.slice(-4)}</span>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                                order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 
                                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </p>
                                        <p className="text-sm text-gray-300 mt-2 truncate max-w-[200px]">
                                            {order.items.map(i => i.name).join(', ')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#E4002B]">R {order.total}</p>
                                        <button className="text-xs font-bold text-white underline mt-1 hover:text-[#E4002B]">
                                            Reorder
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'addresses' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white uppercase">Saved Addresses</h2>
                            <button onClick={() => setIsAddingAddress(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {user.savedAddresses.map((addr) => (
                                <div key={addr.id} className="p-4 rounded-xl bg-black/30 border border-white/10 flex justify-between items-center group">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 p-2 rounded-full bg-white/5 text-gray-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{addr.label}</h4>
                                            <p className="text-sm text-gray-400">{addr.street}, {addr.city}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeAddress(addr.id)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {isAddingAddress && (
                                <div className="p-4 rounded-xl bg-[#E4002B]/5 border border-[#E4002B]/30 animate-in fade-in zoom-in-95">
                                    <h4 className="font-bold text-[#E4002B] mb-3 text-sm uppercase">Add New Address</h4>
                                    <div className="space-y-3">
                                        <input 
                                            placeholder="Label (e.g. Home)" 
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-[#E4002B]"
                                            value={newAddress.label || ''}
                                            onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                                        />
                                        <input 
                                            placeholder="Street Address" 
                                            className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-[#E4002B]"
                                            value={newAddress.street || ''}
                                            onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsAddingAddress(false)} className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-white">Cancel</button>
                                            <button onClick={handleAddAddress} className="flex-1 py-2 bg-[#E4002B] text-white rounded-lg text-xs font-bold uppercase">Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {activeTab === 'wallet' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <h2 className="text-2xl font-black text-white uppercase">Wallet & Payment</h2>
                         <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                             <div className="relative z-10 flex justify-between items-start mb-8">
                                 <span className="font-mono text-white/70 text-sm">Current Balance</span>
                                 <CreditCard className="w-6 h-6 text-white/50" />
                             </div>
                             <div className="text-3xl font-black text-white mb-8 tracking-widest">
                                 •••• •••• •••• 4242
                             </div>
                             <div className="flex justify-between items-end">
                                 <div>
                                     <span className="block text-[10px] text-white/50 uppercase font-bold">Card Holder</span>
                                     <span className="text-sm font-bold text-white">{user.name.toUpperCase()}</span>
                                 </div>
                                 <div className="text-right">
                                     <span className="block text-[10px] text-white/50 uppercase font-bold">Expires</span>
                                     <span className="text-sm font-bold text-white">12/25</span>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="text-center py-6">
                             <button className="text-sm font-bold text-[#E4002B] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                                 <Plus className="w-4 h-4" /> Add New Card
                             </button>
                         </div>
                     </div>
                )}
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileModal;