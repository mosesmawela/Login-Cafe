import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Phone, Facebook, MessageCircle, ArrowRight, ChevronRight, Search, Star, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import OrderModal from './components/OrderModal';
import CartDrawer from './components/CartDrawer';
import LoginModal from './components/LoginModal';
import CateringModal from './components/CateringModal';
import InfoModal from './components/InfoModal';
import OrderTracker from './components/OrderTracker';
import Toast from './components/Toast';
import { ShinyCard } from './components/ShinyCard';
import RoleSwitcher from './components/RoleSwitcher';
import KitchenDashboard from './components/KitchenDashboard';
import AdminDashboard from './components/AdminDashboard';
import DriverDashboard from './components/DriverDashboard';
import ProfileModal from './components/ProfileModal';

// Data & Types
import { MENU_ITEMS, BRANCHES, CONTACT_INFO } from './constants';
import { MenuCategory, MenuItem, Theme, CartItem, User, ToastMessage, Branch, OrderType, UserRole, Order, OrderStatus } from './types';

// Utility
const safeJSONParse = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error parsing ${key} from localStorage`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  // --- CORE STATE ---
  const [role, setRole] = useState<UserRole>('customer');
  const [theme, setTheme] = useState<Theme>(() => safeJSONParse('theme', 'dark'));
  const [user, setUser] = useState<User | null>(() => {
    const parsedUser = safeJSONParse('user', null);
    if (parsedUser) {
        // Migration support for old user objects without new fields
        return {
            ...parsedUser,
            savedAddresses: parsedUser.savedAddresses || [],
            savedCards: parsedUser.savedCards || [],
            orderHistory: parsedUser.orderHistory || [],
            preferences: parsedUser.preferences || {},
            favorites: parsedUser.favorites || []
        } as User;
    }
    return null;
  });
  
  // --- DATA STATE (Simulating Backend) ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]); // "Database" of orders
  const [cart, setCart] = useState<CartItem[]>(() => safeJSONParse('cart', []));

  // --- UI STATE ---
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MenuCategory.CHESANYAMA);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [infoModalState, setInfoModalState] = useState<{ isOpen: boolean, title: string, content: string | React.ReactNode, type: 'policy' | 'promo' | 'info' }>({
      isOpen: false,
      title: '',
      content: '',
      type: 'info'
  });

  // Tracking a specific order for the Customer View
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const activeTrackedOrder = orders.find(o => o.id === trackedOrderId) || null;
  const isTrackerOpen = !!trackedOrderId;

  // --- EFFECT: PERSISTENCE & THEME ---
  useEffect(() => localStorage.setItem('theme', theme), [theme]);
  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);
  useEffect(() => { if (user) localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => {
    const root = document.documentElement;
    if (role === 'customer') {
        if (theme === 'light') root.style.backgroundColor = '#f8f9fa';
        else if (theme === 'grey') root.style.backgroundColor = '#27272a';
        else root.style.backgroundColor = '#050505';
    } else {
        root.style.backgroundColor = '#09090b'; // Dark background for admin/kitchen
    }
  }, [theme, role]);

  // --- HELPERS ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const getThemeClasses = (element: 'bg' | 'text' | 'card' | 'section' | 'subtext' | 'input') => {
      // Force dark mode for non-customer roles for professional look
      if (role !== 'customer') {
          if (element === 'bg') return 'bg-zinc-950';
          if (element === 'text') return 'text-white';
          if (element === 'subtext') return 'text-gray-400';
          return '';
      }

      if (theme === 'light') {
          if (element === 'bg') return 'bg-[#f8f9fa]';
          if (element === 'section') return 'bg-white';
          if (element === 'text') return 'text-gray-900';
          if (element === 'subtext') return 'text-gray-500';
          if (element === 'card') return 'bg-white shadow-xl shadow-gray-200/50 border-none';
          if (element === 'input') return 'bg-white border-gray-200 text-black placeholder-gray-400';
      } else if (theme === 'grey') {
          if (element === 'bg') return 'bg-zinc-900';
          if (element === 'section') return 'bg-zinc-800/50';
          if (element === 'text') return 'text-zinc-100';
          if (element === 'subtext') return 'text-zinc-400';
          if (element === 'card') return 'bg-zinc-800/80 shadow-xl border border-white/5';
          if (element === 'input') return 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500';
      } else { // Dark
          if (element === 'bg') return 'bg-[#050505]';
          if (element === 'section') return 'bg-[#0a0a0a]/80';
          if (element === 'text') return 'text-white';
          if (element === 'subtext') return 'text-gray-400';
          if (element === 'card') return 'bg-[#111]/80 border border-white/10 backdrop-blur-sm';
          if (element === 'input') return 'bg-white/5 border-white/10 text-white placeholder-gray-500';
      }
  };

  // --- CUSTOMER ACTIONS ---
  const handleAddToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    addToast(`Added ${item.name} to bag!`, 'success');
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    addToast('Item removed from bag', 'info');
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
        setCart([]);
        addToast('Cart cleared', 'info');
    }
  };

  const handleToggleFavorite = (code: string) => {
    if (!user) {
        addToast("Please login to save favorites", "info");
        setIsLoginOpen(true);
        return;
    }
    const isFav = user.favorites.includes(code);
    const newFavorites = isFav 
        ? user.favorites.filter(c => c !== code)
        : [...user.favorites, code];
    
    setUser({ ...user, favorites: newFavorites });
    addToast(isFav ? "Removed from favorites" : "Added to favorites", "success");
  };

  const handleOrderPlaced = (
    type: OrderType, 
    financials: { subtotal: number; tax: number; deliveryFee: number; discount: number; total: number }
  ) => {
      // 1. Create the Order Object
      const newOrder: Order = {
          id: `LGN-${Math.floor(Math.random() * 10000)}`,
          customerName: user?.name || "Guest",
          items: [...cart], 
          
          // Financials
          subtotal: financials.subtotal,
          tax: financials.tax,
          deliveryFee: financials.deliveryFee,
          discount: financials.discount,
          total: financials.total,

          status: 'accepted', // Assuming payment was successful via simulator
          type: type,
          createdAt: Date.now(),
          branchName: activeBranch?.name || "Main Branch",
          cookingStatus: 'queued'
      };

      // 2. Add to "Database"
      setOrders(prev => [newOrder, ...prev]);

      // 3. UI Updates
      setIsCartOpen(false);
      setSelectedItem(null);
      setCart([]);
      setTrackedOrderId(newOrder.id); // Open tracker automatically

      // 4. Loyalty & History
      if (user) {
          const pointsEarned = Math.floor(financials.total / 10);
          setUser(prev => prev ? ({ 
              ...prev, 
              points: (prev.points || 0) + pointsEarned,
              orderHistory: [newOrder, ...prev.orderHistory]
          }) : null);
          addToast(`Order placed! You earned ${pointsEarned} loyalty points.`, 'success');
      } else {
          addToast('Order placed! Track it now.', 'success');
      }
  };

  // --- SHARED ACTIONS (Kitchen/Driver/Admin) ---
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      
      const order = orders.find(o => o.id === orderId);
      if (order) {
          const statusMsg = status === 'preparing' ? 'started preparing' : status === 'ready' ? 'marked as Ready' : 'updated';
          addToast(`Order #${orderId.slice(-4)} ${statusMsg}`, 'info');
      }
  };

  const handleUpdateOrder = (orderId: string, updates: Partial<Order>) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
      addToast(`Order #${orderId.slice(-4)} updated`, 'info');
  };

  // --- ADMIN ACTIONS ---
  const handleAddItem = (newItem: MenuItem) => {
      setMenuItems(prev => [...prev, newItem]);
      addToast(`${newItem.name} added to menu`, 'success');
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
      setMenuItems(prev => prev.map(item => item.code === updatedItem.code ? updatedItem : item));
      addToast(`${updatedItem.name} updated`, 'success');
  };

  const handleDeleteItem = (code: string) => {
      setMenuItems(prev => prev.filter(item => item.code !== code));
      addToast(`Item removed from menu`, 'info');
  };

  const handleOpenPromo = () => {
    setInfoModalState({
        isOpen: true,
        title: 'Weekly Promotions',
        content: (
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#E4002B] to-orange-500 text-white shadow-lg">
                    <h4 className="font-black text-lg mb-1">MONSTER KOTA DEAL</h4>
                    <p className="text-sm opacity-90 font-medium">Get a FREE 330ml Coke with every Monster Kota ordered this weekend!</p>
                    <div className="mt-3 bg-white text-[#E4002B] px-3 py-1 rounded-full text-xs font-bold inline-block shadow-sm">CODE: MONSTER24</div>
                </div>
            </div>
        ),
        type: 'promo'
    });
  };

  // --- CUSTOMER RENDER HELPERS ---
  // ⚡ Bolt Optimization: Memoize filteredItems to prevent expensive recalculations
  // on every render (e.g. when typing in search or opening modals).
  // Reduces unnecessary list filtering.
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Filter out unavailable items if not admin (simulated by available flag check if needed, but keeping simple for now)
      if (item.available === false) return false;

      const matchesCategory = item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      if (searchTerm) return matchesSearch;
      return matchesCategory;
    });
  }, [menuItems, activeCategory, searchTerm]);

  // --- RENDER ---
  return (
    <div className={`min-h-screen font-sans overflow-x-hidden transition-colors duration-500 ${getThemeClasses('bg')} ${getThemeClasses('text')}`}>
      
      <RoleSwitcher currentRole={role} onSwitch={setRole} />
      <Toast toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* --- ROLE BASED ROUTING --- */}
      
      {role === 'kitchen' && (
          <KitchenDashboard 
            orders={orders} 
            onUpdateStatus={updateOrderStatus} 
            onUpdateOrder={handleUpdateOrder}
          />
      )}

      {role === 'admin' && (
          <AdminDashboard 
            orders={orders} 
            menuItems={menuItems} 
            onUpdateMenu={setMenuItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
      )}

      {role === 'driver' && (
          <DriverDashboard orders={orders} onUpdateStatus={updateOrderStatus} />
      )}

      {role === 'customer' && (
        <>
            <Navbar 
                theme={theme} 
                onThemeChange={setTheme} 
                cartCount={cart.length}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenLogin={() => setIsLoginOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenCatering={() => setIsCateringOpen(true)}
                onSetLocation={() => setIsLocating(true)} // Simplified for demo
                onOpenPromo={handleOpenPromo}
                user={user}
                activeBranch={activeBranch}
                isLocating={isLocating}
            />

            <div className="pt-[118px] md:pt-[130px]">
                <CartDrawer 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)}
                    cart={cart}
                    onRemoveItem={handleRemoveFromCart}
                    onClearCart={handleClearCart}
                    branches={BRANCHES}
                    onOrderPlaced={handleOrderPlaced}
                />

                <LoginModal 
                    isOpen={isLoginOpen} 
                    onClose={() => setIsLoginOpen(false)} 
                    onLogin={(u) => { setUser(u); addToast(`Welcome back, ${u.name}!`, 'success'); }} 
                />

                {user && (
                    <ProfileModal 
                        isOpen={isProfileOpen} 
                        onClose={() => setIsProfileOpen(false)} 
                        user={user}
                        onUpdateUser={setUser}
                        onLogout={() => {
                            if(window.confirm("Are you sure you want to sign out?")) {
                                setUser(null); 
                                setIsProfileOpen(false); 
                                addToast('Signed out successfully', 'info');
                            }
                        }}
                    />
                )}

                <CateringModal 
                    isOpen={isCateringOpen} 
                    onClose={() => setIsCateringOpen(false)} 
                />
                
                <InfoModal
                    isOpen={infoModalState.isOpen}
                    onClose={() => setInfoModalState(prev => ({ ...prev, isOpen: false }))}
                    title={infoModalState.title}
                    content={infoModalState.content}
                    type={infoModalState.type}
                />

                <OrderTracker 
                    isOpen={isTrackerOpen}
                    onClose={() => setTrackedOrderId(null)}
                    activeOrder={activeTrackedOrder}
                    branch={activeBranch}
                />

                <AIAssistant onOrderClick={setSelectedItem} />
                
                <OrderModal 
                    isOpen={!!selectedItem}
                    selectedItem={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    branches={BRANCHES}
                    onAddToCart={handleAddToCart}
                    activeBranch={activeBranch}
                    onOrderPlaced={(type, total) => handleOrderPlaced(type, { subtotal: total, tax: 0, deliveryFee: 0, discount: 0, total: total })} // Adapter for OrderModal
                />

                {/* Hero Section */}
                <section id="home" className={`relative w-full overflow-hidden transition-colors duration-500 ${theme === 'light' ? 'bg-[#f0f0f0]' : theme === 'grey' ? 'bg-zinc-900' : 'bg-[#050505]'}`}>
                    <div className="absolute inset-0 z-0">
                        {/* Rich gradient background for visual interest */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#E4002B]/10 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    <div className="container mx-auto px-6 py-20 md:py-32 relative z-20 flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 text-left mb-16 md:mb-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-block px-4 py-2 rounded-full border border-[#E4002B]/30 bg-[#E4002B]/10 backdrop-blur-md mb-6">
                                <span className="text-[#E4002B] font-bold uppercase tracking-widest text-xs">
                                    Township Flavour • World Class
                                </span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-6 tracking-tighter mix-blend-normal">
                                MONSTER <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4002B] to-orange-500">KOTA</span> <br/>
                                DOUBLE
                            </h1>
                            <p className={`text-lg md:text-xl font-medium max-w-md mb-10 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                Satisfy your hunger with the ultimate township experience. Twice the flavor, twice the size.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => document.getElementById('menu')?.scrollIntoView({behavior: 'smooth'})}
                                    className="px-10 py-4 rounded-full bg-[#E4002B] text-white font-black uppercase tracking-wider hover:bg-[#c40026] hover:scale-105 transition-all shadow-[0_4px_30px_rgba(228,0,43,0.4)]"
                                >
                                    Order Now
                                </button>
                                {isTrackerOpen && (
                                    <button 
                                        onClick={() => setTrackedOrderId(activeTrackedOrder!.id)} // Re-open
                                        className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 backdrop-blur-md text-white font-bold uppercase tracking-wider transition-all"
                                    >
                                        Track Order
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full md:w-1/2 relative flex justify-center"
                    >
                        <motion.div 
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="relative z-10 aspect-square w-[350px] md:w-[500px]"
                        >
                            <div className={`absolute inset-0 rounded-full blur-[80px] opacity-40 animate-pulse ${theme === 'light' ? 'bg-red-400' : 'bg-[#E4002B]'}`} />
                            <div className="relative w-full h-full rounded-full border-4 border-[#E4002B]/30 shadow-2xl overflow-hidden glass-panel">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center" />
                            </div>
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="absolute -top-4 -right-4 bg-white text-black font-black text-2xl p-6 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.3)] rotate-12 border-4 border-[#E4002B] z-20"
                            >
                                R70
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    </div>
                </section>

                {/* Menu Section */}
                <section id="menu" className={`relative z-10 py-20 px-6 transition-colors duration-500 scroll-mt-32 ${getThemeClasses('section')}`}>
                    <div className="container mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 pb-6 ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}
                    >
                        <div>
                            <h2 className={`text-4xl md:text-5xl font-black uppercase mb-2 tracking-tight ${getThemeClasses('text')}`}>Login Menu</h2>
                            <p className={`font-medium ${getThemeClasses('subtext')}`}>Freshly prepared, strictly delicious.</p>
                        </div>
                        
                        <div className={`relative mt-6 md:mt-0 w-full md:w-80`}>
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Search for kota, hake, ribs..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-3 pl-10 pr-4 rounded-full border outline-none focus:border-[#E4002B] focus:ring-1 focus:ring-[#E4002B] transition-all ${getThemeClasses('input')}`}
                            />
                        </div>
                    </motion.div>

                    <AnimatePresence>
                    {!searchTerm && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-wrap gap-3 mb-12 overflow-hidden"
                        >
                            {Object.values(MenuCategory).map((cat, idx) => (
                            <motion.button
                                key={cat}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border ${
                                activeCategory === cat
                                    ? 'bg-[#E4002B] border-[#E4002B] text-white shadow-lg shadow-red-900/20 scale-105'
                                    : theme === 'light' 
                                        ? 'bg-white border-gray-200 text-gray-600 hover:border-[#E4002B] hover:text-[#E4002B]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#E4002B] hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </motion.button>
                            ))}
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                            <motion.div 
                                key={item.code} 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ShinyCard 
                                    className={`group h-full flex flex-col overflow-hidden !rounded-2xl backdrop-blur-sm ${getThemeClasses('card')}`}
                                    onClick={() => setSelectedItem(item)}
                                    isFavorite={user?.favorites?.includes(item.code)}
                                    onToggleFavorite={() => handleToggleFavorite(item.code)}
                                >
                                <div className="p-6 flex flex-col h-full relative z-10">
                                    <div className="mb-6 flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-white/10 text-gray-400'}`}>{item.code}</span>
                                        </div>
                                        <h3 className={`text-2xl font-black uppercase leading-none mb-3 transition-colors ${theme === 'light' ? 'text-gray-900 group-hover:text-[#E4002B]' : 'text-white group-hover:text-[#E4002B]'}`}>
                                            {item.name}
                                        </h3>
                                        <p className={`text-sm font-medium leading-relaxed ${getThemeClasses('subtext')}`}>
                                            {item.description || "The classic taste you know and love. Grilled to perfection."}
                                        </p>
                                    </div>
                                    
                                    <div className={`pt-6 border-t border-dashed flex items-end justify-between ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                                        <div>
                                            <span className={`block text-[10px] font-bold uppercase mb-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>Price</span>
                                            <span className="text-3xl font-black text-[#E4002B]">R{item.price}</span>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-400 group-hover:bg-[#E4002B] group-hover:text-white' : 'bg-white/10 text-white group-hover:bg-[#E4002B]'}`}>
                                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>
                                </div>
                                </ShinyCard>
                            </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center opacity-60">
                                <p className={`text-xl font-bold ${getThemeClasses('subtext')}`}>No items found matching "{searchTerm}"</p>
                                <button onClick={() => setSearchTerm('')} className="mt-4 text-[#E4002B] font-bold underline">Clear Search</button>
                            </div>
                        )}
                        </AnimatePresence>
                    </motion.div>
                    </div>
                </section>

                <footer className={`py-12 px-6 border-t ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-black border-white/10'}`}>
                    <div className="container mx-auto text-center opacity-50">
                        <p className={`text-xs uppercase font-bold ${getThemeClasses('subtext')}`}>© 2024 Login Cafe. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
      )}
    </div>
  );
};

export default App;