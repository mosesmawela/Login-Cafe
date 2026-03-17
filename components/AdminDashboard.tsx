import React, { useState } from 'react';
import { MenuItem, MenuCategory, Order, OrderStatus } from '../types';
import { LayoutDashboard, DollarSign, ShoppingBag, TrendingUp, Search, Edit2, Plus, X, Trash2, List, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateMenu: (items: MenuItem[]) => void;
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (code: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, menuItems, onUpdateMenu, onAddItem, onUpdateItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'orders'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPromoToast, setShowPromoToast] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});

  // Stats
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const popularItem = orders
    .flatMap(o => o.items)
    .reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);
  
  const bestSeller = Object.entries(popularItem).sort((a,b) => (b[1] as number) - (a[1] as number))[0];

  const filteredMenu = menuItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: MenuItem) => {
      if (item) {
          setEditingItem(item);
          setFormData(item);
      } else {
          setEditingItem(null);
          setFormData({
              code: '',
              name: '',
              price: 0,
              description: '',
              category: MenuCategory.CHESANYAMA,
              available: true
          });
      }
      setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.code || !formData.name || !formData.price) return;

      // Security: Prevent business logic exploitation with negative prices
      if (formData.price < 0) {
          alert("Price cannot be negative");
          return;
      }

      const itemToSave = formData as MenuItem;

      if (editingItem) {
          onUpdateItem(itemToSave);
      } else {
          // Check for duplicate code
          if (menuItems.some(i => i.code === itemToSave.code)) {
              alert("Item code already exists!");
              return;
          }
          onAddItem(itemToSave);
      }
      setIsModalOpen(false);
  };

  const handleCreatePromo = () => {
      setShowPromoToast(true);
      setTimeout(() => setShowPromoToast(false), 3000);
  };

  const toggleAvailability = (code: string) => {
      const item = menuItems.find(i => i.code === code);
      if (item) {
          onUpdateItem({ ...item, available: !item.available });
      }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-28 px-6 pb-10 text-white font-sans relative">
        {/* Promo Toast */}
        <AnimatePresence>
            {showPromoToast && (
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold"
                >
                    <CheckCircle className="w-5 h-5" /> Flash Promo Activated: 20% Off All Burgers!
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
            <div>
                <h2 className="text-4xl font-black uppercase tracking-tight flex items-center gap-3">
                    <LayoutDashboard className="w-10 h-10 text-purple-500" /> Admin Portal
                </h2>
                <p className="text-gray-400 mt-1">Management & Analytics</p>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-xl">
                {['dashboard', 'menu', 'orders'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                            activeTab === tab ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-500/20 text-green-500 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                        <span className="text-green-500 text-xs font-bold">+12% vs last week</span>
                    </div>
                    <h3 className="text-3xl font-black">R {totalRevenue.toLocaleString()}</h3>
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Revenue</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-500/20 text-blue-500 rounded-xl"><ShoppingBag className="w-6 h-6" /></div>
                        <span className="text-blue-500 text-xs font-bold">+5 new today</span>
                    </div>
                    <h3 className="text-3xl font-black">{totalOrders}</h3>
                    <p className="text-gray-500 text-sm font-bold uppercase">Total Orders</p>
                </div>
                <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/20 text-orange-500 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-xl font-black truncate">{bestSeller ? bestSeller[0] : 'N/A'}</h3>
                    <p className="text-gray-500 text-sm font-bold uppercase">Best Seller</p>
                </div>
                <div className="bg-gradient-to-br from-[#E4002B] to-purple-600 p-6 rounded-2xl text-white flex flex-col justify-center items-center text-center">
                    <h3 className="font-black uppercase text-xl mb-2">Boost Sales</h3>
                    <p className="text-xs opacity-80 mb-4">Activate a flash promo for all users.</p>
                    <button 
                        onClick={handleCreatePromo}
                        className="px-4 py-2 bg-white text-black rounded-lg font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
                    >
                        Create Promo
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'menu' && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
                    <h3 className="text-xl font-black uppercase">Menu Management</h3>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search Items..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-purple-500 outline-none w-64 text-white placeholder-gray-600"
                            />
                        </div>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-gray-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs font-bold uppercase">
                            <tr>
                                <th className="p-4">Item</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price (R)</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredMenu.map((item) => (
                                <tr key={item.code} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-bold">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-[10px] text-gray-400">
                                                {item.code}
                                            </div>
                                            <div>
                                                <div className="text-white">{item.name}</div>
                                                <div className="text-[10px] text-gray-500 max-w-xs truncate">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">{item.category}</td>
                                    <td className="p-4 font-mono font-bold text-[#E4002B]">
                                        R {item.price}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleAvailability(item.code)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                                item.available !== false 
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20' 
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                            }`}
                                        >
                                            {item.available !== false ? 'In Stock' : 'Out of Stock'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenModal(item)}
                                                className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Delete ${item.name}?`)) onDeleteItem(item.code);
                                                }}
                                                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-500/10 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="p-6 border-b border-white/10">
                     <h3 className="text-xl font-black uppercase">All Orders</h3>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/50 text-gray-400 text-xs font-bold uppercase">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm text-gray-400">#{order.id.slice(-4)}</td>
                                        <td className="p-4 font-bold text-white">{order.customerName}</td>
                                        <td className="p-4 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-[#E4002B]">R {order.total}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                order.status === 'completed' || order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                                                order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400 max-w-xs truncate">
                                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        <h3 className="text-2xl font-black uppercase mb-6 flex justify-between items-center">
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>
                        </h3>
                        
                        <form onSubmit={handleSaveItem} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                                    <input 
                                        required
                                        disabled={!!editingItem}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white disabled:opacity-50"
                                        value={formData.code}
                                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (R)</label>
                                    <input 
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input 
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white resize-none"
                                    rows={2}
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                <select 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value as MenuCategory})}
                                >
                                    {Object.values(MenuCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full py-3 bg-[#E4002B] text-white font-bold uppercase rounded-xl hover:bg-red-600 transition-colors mt-4"
                            >
                                Save Item
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;