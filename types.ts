export interface MenuItem {
  code: string;
  name: string;
  price: number;
  description?: string;
  category: MenuCategory;
  available?: boolean; // New: for Admin to toggle stock
  image?: string; // New: for Admin visualization
}

export enum MenuCategory {
  CHESANYAMA = 'Chesanyama',
  GRILLED_CHICKEN = 'Grilled Chicken',
  BURGERS = 'Burgers',
  RIBS = 'Ribs',
  KOTA = 'Kota',
  FISH_CHIPS = 'Fish & Chips',
  EXTRAS = 'Extras'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Branch {
  name: string;
  address: string;
  note?: string;
  lat: number;
  lng: number;
}

export type Theme = 'light' | 'dark' | 'grey';

export interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

// --- NEW TYPES FOR PROFILES ---

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  street: string;
  city: string;
}

export interface PaymentMethod {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  expiry: string;
}

export interface UserPreferences {
  halal?: boolean;
  spicy?: boolean;
  vegan?: boolean;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  points: number;
  role: UserRole;
  savedAddresses: Address[];
  savedCards: PaymentMethod[];
  orderHistory: Order[]; 
  preferences: UserPreferences;
  favorites: string[]; // item codes
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface CateringFormData {
  name: string;
  phone: string;
  date: string;
  guests: number;
  details: string;
}

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export type UserRole = 'customer' | 'kitchen' | 'admin' | 'driver';

export type OrderStatus = 'pending_payment' | 'paid' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  
  // Financials
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;

  status: OrderStatus;
  type: OrderType;
  createdAt: number; // Timestamp
  branchName: string;
  note?: string;

  // Kitchen Specifics
  isPriority?: boolean;
  issue?: string; // e.g., "Missing Ingredient"
  rejectionReason?: string;
  cookingStart?: number; // timestamp
  cookingStatus?: 'queued' | 'cooking' | 'paused' | 'done';
}