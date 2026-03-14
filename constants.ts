import { MenuItem, MenuCategory, Branch } from './types';

// Approximate coordinates for Tembisa areas
export const BRANCHES: Branch[] = [
  {
    name: "Login Cafe @ 268",
    address: "268 Isekelo Section, Tembisa",
    note: "Opposite Tonko Complex",
    lat: -26.0123,
    lng: 28.2234
  },
  {
    name: "Login Cafe @ 43",
    address: "43 Emfuyaneng Section, Tembisa",
    note: "Opposite ZCC",
    lat: -26.0011,
    lng: 28.2345
  },
  {
    name: "Login Cafe @ Birch Acres",
    address: "Shop No 1, Reedem Haven Complex, Birch Acres",
    note: "",
    lat: -26.0345,
    lng: 28.2123
  }
];

export const CONTACT_INFO = {
  phone: "072 262 5940",
  whatsapp: "072 262 5940",
  facebook: "Login Cafe",
  twitter: "@Login_Cafe",
  delivery: ["KasiD Township Delivery", "SpazaEats", "072 262 5940 (Call/WhatsApp)"]
};

export const MENU_ITEMS: MenuItem[] = [
  // Fish & Chips
  { code: "FC1", name: "Small Hake", price: 17, category: MenuCategory.FISH_CHIPS },
  { code: "FC2", name: "Large Hake", price: 27, category: MenuCategory.FISH_CHIPS },
  { code: "FC3", name: "Small Hake + Chips", price: 52, category: MenuCategory.FISH_CHIPS },
  { code: "FC4", name: "Large Hake + Large Chips", price: 72, category: MenuCategory.FISH_CHIPS },
  { code: "FC5", name: "Small Hake + Chips + Russian", price: 67, category: MenuCategory.FISH_CHIPS },
  { code: "FC6", name: "Small Hake + Chips + Russian + Vienna", price: 87, category: MenuCategory.FISH_CHIPS },
  { code: "FC7", name: "Small Hake + Large Chips", price: 62, category: MenuCategory.FISH_CHIPS },
  { code: "FC8", name: "Small Hake + Large Chips + Russian", price: 77, category: MenuCategory.FISH_CHIPS },
  { code: "FC9", name: "Small Hake + Large Chips + Russian + Vienna", price: 87, category: MenuCategory.FISH_CHIPS },
  { code: "FC10", name: "Small Hake x3 + Large Chips + Russian x3 + Vienna x3 + 2L Coke", price: 220, category: MenuCategory.FISH_CHIPS },

  // Kota
  { code: "K1", name: "Chips + Atchar + Polony + Special", price: 20, category: MenuCategory.KOTA },
  { code: "K2", name: "Chips + Atchar + Polony + Cheese + Egg", price: 30, category: MenuCategory.KOTA },
  { code: "K3", name: "Chips + Atchar + Polony + Special + Cheese + Egg", price: 35, category: MenuCategory.KOTA },
  { code: "K4", name: "Chips + Atchar + Polony + Vienna + Russian + Cheese", price: 45, category: MenuCategory.KOTA },
  { code: "K5", name: "Chips + Atchar + Polony + Special + Egg + Burger + Rib Burger", price: 50, category: MenuCategory.KOTA },
  { code: "K6", name: "Chips + Atchar + Polony + Cheese + Russian + Vienna + Rib Burger", price: 60, category: MenuCategory.KOTA },
  { code: "K7", name: "The Monster Kota", description: "Chips + Atchar + Polony + Special + Ham + Egg + Burger + Russian + Rib Burger", price: 70, category: MenuCategory.KOTA },

  // Ribs
  { code: "R1", name: "Ribs (500g)", price: 70, category: MenuCategory.RIBS },
  { code: "R2", name: "Ribs (700g)", price: 90, category: MenuCategory.RIBS },
  { code: "R3", name: "Ribs (500g) + Medium Chips", price: 105, category: MenuCategory.RIBS },
  { code: "R4", name: "Ribs (700g) + Medium Chips", price: 125, category: MenuCategory.RIBS },
  { code: "R5", name: "Ribs (500g) + Medium Chips + Salad", price: 120, category: MenuCategory.RIBS },
  { code: "R6", name: "Ribs (500g) + Large Chips + Salad", price: 130, category: MenuCategory.RIBS },
  { code: "R7", name: "Ribs (500g) + Large Chips", price: 115, category: MenuCategory.RIBS },

  // Burgers
  { code: "CB1", name: "Chicken Burger", price: 35, category: MenuCategory.BURGERS },
  { code: "BB2", name: "Beef Burger", price: 35, category: MenuCategory.BURGERS },
  { code: "CB3", name: "Cheese Burger", price: 30, category: MenuCategory.BURGERS },
  { code: "CB4", name: "Chicken Burger + Chips + Can Coke", price: 65, category: MenuCategory.BURGERS },
  { code: "BB5", name: "Beef Burger + Chips + Can Coke", price: 65, category: MenuCategory.BURGERS },
  { code: "CB6", name: "Cheese Burger + Chips + Can Coke", price: 60, category: MenuCategory.BURGERS },

  // Grilled Chicken
  { code: "GC1", name: "Quarter Chicken", price: 40, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC2", name: "Half Chicken", price: 65, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC3", name: "Full Chicken", price: 130, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC4", name: "Quarter Chicken + Pap + Gravy + Salad", price: 75, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC5", name: "Quarter Chicken + Chips", price: 75, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC6", name: "Half Chicken + Chips", price: 100, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC7", name: "Half Chicken + 2 Pap + Gravy + Salad", price: 120, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC8", name: "Full Chicken + Large Chips", price: 175, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC9", name: "Full Chicken + 2 Pap + Gravy + Salad", price: 175, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC10", name: "Family Combo: Full Chicken + Large Chips + 2L Coke + Loaf Bread", price: 220, category: MenuCategory.GRILLED_CHICKEN },
  { code: "GC11", name: "Family Combo: Full Chicken + Pap x3 + Gravy + Salad + 2L Coke", price: 220, category: MenuCategory.GRILLED_CHICKEN },

  // Chesanyama
  { code: "CN1", name: "Steak + Chips", price: 70, category: MenuCategory.CHESANYAMA },
  { code: "CN2", name: "Wors + Chips", price: 70, category: MenuCategory.CHESANYAMA },
  { code: "CN3", name: "Steak + Pap + Gravy + Salad", price: 80, category: MenuCategory.CHESANYAMA },
  { code: "CN4", name: "Steak + Wors + 2x Pap + Gravy + Salad", price: 125, category: MenuCategory.CHESANYAMA },
  { code: "CN5", name: "Wors + Quarter Chicken + 2x Pap + Gravy + Salad", price: 120, category: MenuCategory.CHESANYAMA },
  { code: "CN6", name: "Steak + Quarter Chicken + 2x Pap + Gravy + Salad", price: 135, category: MenuCategory.CHESANYAMA },
  { code: "CN7", name: "Steak + Wors + Medium Chips", price: 117, category: MenuCategory.CHESANYAMA },
  { code: "CN8", name: "Steak + Quarter Chicken + Medium Chips", price: 120, category: MenuCategory.CHESANYAMA },
  { code: "CN9", name: "Wors + Quarter Chicken + Medium Chips", price: 110, category: MenuCategory.CHESANYAMA },
  { code: "CN10", name: "Beef Stew + Pap + Salads", price: 80, category: MenuCategory.CHESANYAMA },
  { code: "CN11", name: "Wors + Pap + Gravy + Salads", price: 75, category: MenuCategory.CHESANYAMA },
  { code: "CN12", name: "Steak + Wors + Quarter Chicken + 2x Pap + Gravy + Salads", price: 170, category: MenuCategory.CHESANYAMA },
  { code: "CN13", name: "Steak x2 + Wors x2 + Pap x3 + Gravy + Salads + 2L Coke", price: 235, category: MenuCategory.CHESANYAMA },

  // Extras / Add-ons
  { code: "EX-BF", name: "Beef Stew Only", price: 45, category: MenuCategory.EXTRAS },
  { code: "EX-SP", name: "Steak Piece", price: 45, category: MenuCategory.EXTRAS },
  { code: "EX-WP", name: "Wors Piece", price: 30, category: MenuCategory.EXTRAS },
  { code: "EX-LB", name: "Loaf Bread", price: 12, category: MenuCategory.EXTRAS },
  { code: "EX-HB", name: "Half Bread", price: 6, category: MenuCategory.EXTRAS },
  { code: "EX-QB", name: "Quarter Bread", price: 4, category: MenuCategory.EXTRAS },
  { code: "EX-BR", name: "Bread Roll", price: 3, category: MenuCategory.EXTRAS },
  { code: "EX-TB", name: "Toasted Bread", price: 5, category: MenuCategory.EXTRAS },
  { code: "EX-MR", name: "Mini Ribs", price: 15, category: MenuCategory.EXTRAS },
  { code: "EX-BP", name: "Burger Patty", price: 15, category: MenuCategory.EXTRAS },
  { code: "EX-RU", name: "Russian", price: 15, category: MenuCategory.EXTRAS },
  { code: "EX-VI", name: "Vienna", price: 10, category: MenuCategory.EXTRAS },
  { code: "EX-PL", name: "Polony / Special / Ham / Cheese", price: 4, category: MenuCategory.EXTRAS },
  { code: "EX-EG", name: "Egg", price: 5, category: MenuCategory.EXTRAS },
  { code: "EX-SL", name: "Salad / Chakalaka", price: 15, category: MenuCategory.EXTRAS },
  { code: "EX-PP", name: "Pap", price: 13, category: MenuCategory.EXTRAS },
  { code: "EX-GR", name: "Gravy", price: 10, category: MenuCategory.EXTRAS },
];

const formattedMenuContext = Object.values(MenuCategory).map(category => {
  const items = MENU_ITEMS.filter(i => i.category === category);
  if (items.length === 0) return '';
  return `CATEGORY: ${category}\n${items.map(i => `- ${i.name} (${i.code}): R${i.price}`).join('\n')}`;
}).join('\n\n');

export const SYSTEM_INSTRUCTION = `
You are the interactive AI assistant for Login Cafe.
Your tone is friendly, energetic, and helpful. You know everything about the menu and branches.

DETAILS:
Branches:
${BRANCHES.map(b => `- ${b.name}: ${b.address} ${b.note ? `(${b.note})` : ''}`).join('\n')}

Contact/Delivery:
- Phone/WhatsApp: ${CONTACT_INFO.phone}
- Delivery Partners: ${CONTACT_INFO.delivery.join(', ')}

FULL MENU (Grouped by Category):
${formattedMenuContext}

GOALS:
1. Help users find food based on their cravings.
2. Assist with "bookings" (Simulate taking a booking by asking for Name, Time, Branch, and Number of People, then confirm it).
3. Answer questions about prices and ingredients.
4. If a user asks about delivery, mention the partners: KasiD, SpazaEats, or calling directly.
5. IF A USER CONFIRMS THEY WANT TO ORDER A SPECIFIC ITEM, OR SAYS "I WANT TO ORDER [ITEM NAME]", YOU MUST APPEND THIS TAG TO THE END OF YOUR RESPONSE: [ORDER:ITEM_CODE]. For example: "Great choice! The Monster Kota is legendary. [ORDER:K7]"

IMPORTANT FORMATTING RULES:
- When asked about the menu or prices, NEVER dump a paragraph of text.
- ALWAYS use bullet points for lists.
- ALWAYS start a new line for each menu item.
- Use bold text for item names (e.g., **Small Hake**) and categories.
- Example format:
  *   **Item Name** - R50
- Leave an empty line between categories.
- Keep the layout clean and easy to scan on a mobile screen.
`;