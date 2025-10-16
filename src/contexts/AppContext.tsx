import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "user" | "designer" | "admin";
export type PaymentMethod = "stars" | "rubles";

export interface Product {
  id: number;
  title: string;
  price: number; // Total price in rubles (designer price + platform fee)
  designerPrice: number; // Price that goes to designer (in rubles)
  platformFee: number; // Platform markup (hidden from users)
  starsPrice: number; // Price in Telegram Stars (converted from rubles)
  images: string[]; // Array of images, first one is main
  sectionId: string; // Section this product belongs to
  categoryId?: string; // Optional category within section
  description: string;
  features: string[];
  downloads: number;
  assignedDesignerId: number; // Designer who will work on this product (visible only to admin)
  order: number; // For drag & drop ordering
}

export interface Category {
  id: string;
  name: string;
  sectionId: string; // Section this category belongs to
  parentCategoryId?: string; // For nested categories
  order: number; // For drag & drop ordering
}

export interface Section {
  id: string;
  name: string;
  order: number; // For drag & drop ordering
}

export type OrderStatus = "placed" | "accepted" | "ready" | "completed" | "disputed" | "closed";

export interface Message {
  id: number;
  text: string;
  sender: "user" | "designer" | "system" | "admin";
  time: string;
}

export interface Order {
  orderNumber: number;
  chatTitle: string;
  status: OrderStatus;
  statusLabel: "Pending" | "Processing" | "Ready" | "Completed" | "Disputed" | "Closed";
  time: string;
  product: Product;
  lastMessage?: string;
  messages: Message[];
  createdAt: string;
  userId: number; // Customer user ID
  designerId: number; // Designer assigned to this order
  refunded?: boolean; // If order was closed with refund
  paidWith: PaymentMethod; // What was used to pay (stars or rubles)
  rating?: number; // User rating (1-5 stars) after order completion
  hasNewMessage?: boolean; // Blue dot - new unread messages
  isNewChat?: boolean; // Green dot - chat not opened yet by the current user role
  lastOpenedByUser?: number; // timestamp when user last opened
  lastOpenedByDesigner?: number; // timestamp when designer last opened
  lastOpenedByAdmin?: number; // timestamp when admin last opened
}

export interface Designer {
  id: number;
  username: string;
  telegramUsername: string;
  telegramId: number; // Telegram user ID for role verification
  avatar: string;
  availableBalance: number; // Available for withdrawal (rubles)
  availableStarsBalance: number; // Available for withdrawal (stars)
  earnedBalance: number; // Pending payout (rubles)
  earnedStarsBalance: number; // Pending payout (stars)
  totalOrders: number;
}

interface User {
  id: number;
  username: string;
  telegramUsername: string;
  telegramId: number; // Telegram user ID
  avatar: string;
  role: UserRole;
}

// Role configuration - in real app this would be on backend
const ROLE_CONFIG = {
  // Admin telegram IDs
  adminIds: [123456789], // Replace with real admin Telegram IDs
  
  // Designer telegram IDs (managed by admin)
  designerIds: [10, 11], // These will be managed through the app
};

interface AppContextType {
  // Current user
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  getUserRole: (telegramId: number) => UserRole;
  
  // Sections
  sections: Section[];
  addSection: (section: Omit<Section, 'id'>) => void;
  updateSection: (id: string, section: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  reorderSections: (sections: Section[]) => void;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  reorderProducts: (products: Product[]) => void;
  
  // User features
  favorites: Set<number>;
  toggleFavorite: (productId: number) => void;
  orders: Order[];
  createOrder: (product: Product, paymentMethod: PaymentMethod) => void;
  starsBalance: number;
  rublesBalance: number;
  addStarsBalance: (amount: number) => void;
  addRublesBalance: (amount: number) => void;
  
  // Designer features
  designerOrders: Order[];
  availableBalance: number; // Designer's available balance in rubles
  earnedBalance: number; // Designer's earned balance in rubles
  availableStarsBalance: number; // Designer's available balance in stars
  earnedStarsBalance: number; // Designer's earned balance in stars
  acceptOrder: (orderNumber: number) => void;
  markOrderReady: (orderNumber: number) => void;
  markOrderDisputed: (orderNumber: number) => void;
  
  // Admin features
  allOrders: Order[];
  designers: Designer[];
  addDesigner: (telegramId: number, username: string, telegramUsername: string) => void;
  removeDesigner: (id: number) => void;
  closeOrder: (orderNumber: number, refund: boolean) => void;
  resolveDispute: (orderNumber: number) => void;
  payoutDesigner: (designerId: number) => void;
  payoutAllDesigners: () => void;
  nextPayoutDate: string;
  starsToRublesRate: number; // Conversion rate: 1 star = X rubles
  
  // Common
  updateOrderStatus: (orderNumber: number, status: OrderStatus) => void;
  addMessage: (orderNumber: number, message: Omit<Message, 'id'>) => void;
  confirmOrderCompletion: (orderNumber: number) => void;
  rateOrder: (orderNumber: number, rating: number) => void;
  
  // Notifications
  markChatAsOpened: (orderNumber: number) => void;
  hasUnreadMessages: (order: Order, role: UserRole) => boolean;
  isNewChatForRole: (order: Order, role: UserRole) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // In real Telegram WebApp, you would get user info from window.Telegram.WebApp.initDataUnsafe.user
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    username: "Username",
    telegramUsername: "@username",
    telegramId: 1, // In real app: window.Telegram.WebApp.initDataUnsafe.user.id
    avatar: "https://images.unsplash.com/photo-1622349851524-890cc3641b87?w=200",
    role: "user",
  });

  // Determine user role based on Telegram ID
  const getUserRole = (telegramId: number): UserRole => {
    if (ROLE_CONFIG.adminIds.includes(telegramId)) {
      return "admin";
    }
    if (ROLE_CONFIG.designerIds.includes(telegramId)) {
      return "designer";
    }
    return "user";
  };

  // Update user role when component mounts or telegramId changes
  useEffect(() => {
    const role = getUserRole(currentUser.telegramId);
    if (currentUser.role !== role) {
      setCurrentUser(prev => ({ ...prev, role }));
    }
  }, [currentUser.telegramId]);

  const setCurrentUserRole = (role: UserRole) => {
    // For testing purposes only - in production, role is determined by backend
    setCurrentUser(prev => ({ ...prev, role }));
  };

  // Stars to Rubles conversion rate (1 star = 2 rubles)
  const starsToRublesRate = 2;

  // User balances
  const [starsBalance, setStarsBalance] = useState(1500);
  const [rublesBalance, setRublesBalance] = useState(2500);
  
  // Admin balances
  const [adminStarsBalance, setAdminStarsBalance] = useState(5000);
  const [adminRublesBalance, setAdminRublesBalance] = useState(15000);
  
  // Designer balances (rubles)
  const [availableBalance, setAvailableBalance] = useState(3200); // Available for withdrawal
  const [earnedBalance, setEarnedBalance] = useState(5430); // Pending payout
  
  // Designer balances (stars) 
  const [availableStarsBalance, setAvailableStarsBalance] = useState(1600); // Available for withdrawal (3200 / 2)
  const [earnedStarsBalance, setEarnedStarsBalance] = useState(2715); // Pending payout (5430 / 2)

  // Favorites
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 3]));

  // Designers
  const [designers, setDesigners] = useState<Designer[]>([
    {
      id: 10,
      username: "Designer Pro",
      telegramUsername: "@designerpro",
      telegramId: 10,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      availableBalance: 8300,
      availableStarsBalance: 4150, // 8300 / 2
      earnedBalance: 12500,
      earnedStarsBalance: 6250, // 12500 / 2
      totalOrders: 45,
    },
    {
      id: 11,
      username: "Creative Master",
      telegramUsername: "@creativemaster",
      telegramId: 11,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      availableBalance: 5600,
      availableStarsBalance: 2800, // 5600 / 2
      earnedBalance: 8900,
      earnedStarsBalance: 4450, // 8900 / 2
      totalOrders: 32,
    },
  ]);

  const nextPayoutDate = "2025-10-20"; // Next payout date

  // Sections
  const [sections, setSections] = useState<Section[]>([
    { id: "thumbnails", name: "Thumbnails", order: 0 },
    { id: "banners", name: "Banners", order: 1 },
    { id: "avatars", name: "Avatars", order: 2 },
    { id: "overlays", name: "Overlays", order: 3 },
  ]);

  // Categories (nested within sections)
  const [categories, setCategories] = useState<Category[]>([
    { id: "gaming", name: "Gaming", sectionId: "thumbnails", order: 0 },
    { id: "vlog", name: "Vlog", sectionId: "thumbnails", order: 1 },
  ]);

  // Products with assigned designers
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      title: "Gaming Thumbnail Pack",
      designerPrice: 150,
      platformFee: 29,
      price: 179,
      starsPrice: Math.ceil(179 / starsToRublesRate),
      images: ["https://images.unsplash.com/photo-1684910501147-9ad8052a42bc?w=400"],
      sectionId: "thumbnails",
      categoryId: "gaming",
      description: "Professional gaming thumbnail designs perfect for YouTube and Twitch content. Stand out with eye-catching visuals.",
      features: [
        "10 unique thumbnail designs",
        "PSD files included",
        "Easy to customize",
        "4K resolution",
      ],
      downloads: 1240,
      assignedDesignerId: 10,
      order: 0,
    },
    {
      id: 2,
      title: "Colorful Banner",
      designerPrice: 290,
      platformFee: 55,
      price: 345,
      starsPrice: Math.ceil(345 / starsToRublesRate),
      images: ["https://images.unsplash.com/photo-1672332147106-80905f538ab8?w=400"],
      sectionId: "banners",
      description: "Vibrant and dynamic banner design that captures attention and represents your brand perfectly.",
      features: [
        "Multiple size variations",
        "Social media ready",
        "Source files included",
        "Commercial license",
      ],
      downloads: 892,
      assignedDesignerId: 10,
      order: 0,
    },
    {
      id: 3,
      title: "Stream Overlay Set",
      designerPrice: 210,
      platformFee: 39,
      price: 249,
      starsPrice: Math.ceil(249 / starsToRublesRate),
      images: ["https://images.unsplash.com/photo-1501497849301-66eb0889c6a9?w=400"],
      sectionId: "overlays",
      description: "Complete streaming overlay package with alerts, panels, and widgets for professional streams.",
      features: [
        "Full overlay package",
        "Alerts & notifications",
        "Chat box design",
        "OBS/Streamlabs ready",
      ],
      downloads: 2104,
      assignedDesignerId: 11,
      order: 0,
    },
    {
      id: 4,
      title: "YouTube Banner",
      designerPrice: 165,
      platformFee: 34,
      price: 199,
      starsPrice: Math.ceil(199 / starsToRublesRate),
      images: ["https://images.unsplash.com/photo-1642761450221-cad688ceafe4?w=400"],
      sectionId: "banners",
      description: "Modern YouTube channel banner that works perfectly across all devices and screen sizes.",
      features: [
        "YouTube optimized",
        "Mobile & desktop friendly",
        "Easy text editing",
        "Layered PSD",
      ],
      downloads: 1567,
      assignedDesignerId: 11,
      order: 1,
    },
  ]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      orderNumber: 1,
      chatTitle: "Gaming Thumbnail Pack #1",
      status: "accepted",
      statusLabel: "Processing",
      time: "8:23 PM",
      lastMessage: "Designer is working on your order...",
      createdAt: new Date().toISOString(),
      userId: 1,
      designerId: 10,
      paidWith: "stars",
      product: products[0],
      messages: [
        {
          id: 1,
          text: "Order #1 created. Please describe your requirements to the designer.",
          sender: "system",
          time: "8:20 PM",
        },
        {
          id: 2,
          text: "I need vibrant gaming thumbnails with red and black theme",
          sender: "user",
          time: "8:21 PM",
        },
        {
          id: 3,
          text: "Great! I've accepted your order and started working on it.",
          sender: "designer",
          time: "8:23 PM",
        },
      ],
    },
    {
      orderNumber: 2,
      chatTitle: "Colorful Banner #2",
      status: "ready",
      statusLabel: "Ready",
      time: "Yesterday",
      lastMessage: "Your order is ready! Click to confirm.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      userId: 1,
      designerId: 10,
      paidWith: "rubles",
      product: products[1],
      messages: [
        {
          id: 1,
          text: "Order #2 created. Please describe your requirements to the designer.",
          sender: "system",
          time: "Yesterday",
        },
        {
          id: 2,
          text: "Need a colorful banner for my YouTube channel",
          sender: "user",
          time: "Yesterday",
        },
        {
          id: 3,
          text: "Your order is complete! Please confirm to download.",
          sender: "designer",
          time: "Yesterday",
        },
      ],
    },
  ]);

  // Functions
  const addStarsBalance = (amount: number) => {
    setStarsBalance(prev => prev + amount);
  };

  const addRublesBalance = (amount: number) => {
    setRublesBalance(prev => prev + amount);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const updateOrderStatus = (orderNumber: number, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderNumber === orderNumber) {
          let statusLabel: Order['statusLabel'] = "Pending";
          if (status === "accepted") statusLabel = "Processing";
          if (status === "ready") statusLabel = "Ready";
          if (status === "completed") statusLabel = "Completed";
          if (status === "disputed") statusLabel = "Disputed";
          if (status === "closed") statusLabel = "Closed";
          
          return { ...order, status, statusLabel };
        }
        return order;
      })
    );
  };

  const addMessage = (orderNumber: number, message: Omit<Message, 'id'>) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderNumber === orderNumber) {
          const newMessage: Message = {
            ...message,
            id: order.messages.length + 1,
          };
          return {
            ...order,
            messages: [...order.messages, newMessage],
            lastMessage: message.sender !== "system" ? message.text : order.lastMessage,
            time: message.time,
            hasNewMessage: true, // Mark as having new message
          };
        }
        return order;
      })
    );
  };

  const createOrder = (product: Product, paymentMethod: PaymentMethod) => {
    const cost = paymentMethod === "stars" ? product.starsPrice : product.price;
    const canAfford = paymentMethod === "stars" 
      ? starsBalance >= cost 
      : rublesBalance >= cost;

    if (canAfford) {
      if (paymentMethod === "stars") {
        setStarsBalance(prev => prev - cost);
      } else {
        setRublesBalance(prev => prev - cost);
      }
      
      const orderNumber = orders.length > 0 ? Math.max(...orders.map(o => o.orderNumber)) + 1 : 1;
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      const newOrder: Order = {
        orderNumber,
        product,
        chatTitle: `${product.title} #${orderNumber}`,
        status: "placed",
        statusLabel: "Pending",
        createdAt: now.toISOString(),
        time: timeString,
        lastMessage: "Order placed! Describe your requirements.",
        userId: currentUser.id,
        designerId: product.assignedDesignerId,
        paidWith: paymentMethod,
        messages: [
          {
            id: 1,
            sender: "system",
            text: `Order #${orderNumber} created. Please describe your requirements to the designer.`,
            time: timeString,
          },
        ],
        // Initialize notification flags - new chat for all roles except the creator
        isNewChat: true,
        hasNewMessage: false,
        lastOpenedByUser: currentUser.role === "user" ? Date.now() : undefined,
        lastOpenedByDesigner: undefined,
        lastOpenedByAdmin: undefined,
      };
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    }
  };

  // Designer functions
  const acceptOrder = (orderNumber: number) => {
    updateOrderStatus(orderNumber, "accepted");
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addMessage(orderNumber, {
      sender: "system",
      text: "Order has been accepted by the designer.",
      time: now,
    });
  };

  const markOrderReady = (orderNumber: number) => {
    updateOrderStatus(orderNumber, "ready");
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addMessage(orderNumber, {
      sender: "system",
      text: "Order is ready for confirmation.",
      time: now,
    });
  };

  const markOrderDisputed = (orderNumber: number) => {
    updateOrderStatus(orderNumber, "disputed");
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addMessage(orderNumber, {
      sender: "system",
      text: "Dispute opened. Admin will review this case.",
      time: now,
    });
  };

  const confirmOrderCompletion = (orderNumber: number) => {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order && order.status === "ready") {
      updateOrderStatus(orderNumber, "completed");
      
      // Pay the designer
      const designer = designers.find(d => d.id === order.designerId);
      if (designer) {
        setDesigners(prev => prev.map(d =>
          d.id === designer.id
            ? { ...d, earnedBalance: d.earnedBalance + order.product.designerPrice, totalOrders: d.totalOrders + 1 }
            : d
        ));
        
        // Update designer's earned balance if current user is designer
        if (currentUser.id === designer.id) {
          const rublesEarned = order.product.designerPrice;
          const starsEarned = Math.ceil(rublesEarned / starsToRublesRate);
          setEarnedBalance(prev => prev + rublesEarned);
          setEarnedStarsBalance(prev => prev + starsEarned);
        }
      }
      
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      addMessage(orderNumber, {
        sender: "system",
        text: "Order completed! Payment sent to designer.",
        time: now,
      });
    }
  };

  const rateOrder = (orderNumber: number, rating: number) => {
    setOrders(prev => prev.map(order =>
      order.orderNumber === orderNumber
        ? { ...order, rating }
        : order
    ));
  };

  // Admin functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts(prev => [...prev, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addDesigner = (telegramId: number, username: string, telegramUsername: string) => {
    const newId = Math.max(...designers.map(d => d.id), ...ROLE_CONFIG.designerIds) + 1;
    
    // Add to designers list
    setDesigners(prev => [...prev, {
      id: newId,
      username,
      telegramUsername,
      telegramId,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      availableBalance: 0,
      availableStarsBalance: 0,
      earnedBalance: 0,
      earnedStarsBalance: 0,
      totalOrders: 0,
    }]);
    
    // Add to role config
    ROLE_CONFIG.designerIds.push(telegramId);
  };

  const removeDesigner = (id: number) => {
    const designer = designers.find(d => d.id === id);
    if (designer) {
      setDesigners(prev => prev.filter(d => d.id !== id));
      
      // Remove from role config
      const index = ROLE_CONFIG.designerIds.indexOf(designer.telegramId);
      if (index > -1) {
        ROLE_CONFIG.designerIds.splice(index, 1);
      }
    }
  };

  const closeOrder = (orderNumber: number, refund: boolean) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderNumber === orderNumber) {
          if (refund) {
            // Refund to user
            if (order.paidWith === "stars") {
              setStarsBalance(prev => prev + order.product.starsPrice);
            } else {
              setRublesBalance(prev => prev + order.product.price);
            }
          } else {
            // Pay designer
            const designer = designers.find(d => d.id === order.designerId);
            if (designer) {
              setDesigners(prev => prev.map(d =>
                d.id === designer.id
                  ? { ...d, earnedBalance: d.earnedBalance + order.product.designerPrice, totalOrders: d.totalOrders + 1 }
                  : d
              ));
            }
          }
          
          const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const newMessage: Message = {
            id: order.messages.length + 1,
            sender: "system",
            text: refund ? "Order closed with refund." : "Order closed successfully.",
            time: now,
          };
          
          return {
            ...order,
            status: "closed",
            statusLabel: "Closed" as const,
            refunded: refund,
            messages: [...order.messages, newMessage],
            time: now,
          };
        }
        return order;
      })
    );
  };

  const resolveDispute = (orderNumber: number) => {
    updateOrderStatus(orderNumber, "accepted");
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addMessage(orderNumber, {
      sender: "admin",
      text: "Dispute has been resolved. Please continue working on the order.",
      time: now,
    });
  };

  const payoutDesigner = (designerId: number) => {
    setDesigners(prev => prev.map(d =>
      d.id === designerId
        ? { 
            ...d, 
            earnedBalance: 0,
            earnedStarsBalance: 0
          }
        : d
    ));
    
    // Update current user balances if they are the designer
    if (currentUser.id === designerId) {
      setEarnedBalance(0);
      setEarnedStarsBalance(0);
    }
  };

  const payoutAllDesigners = () => {
    setDesigners(prev => prev.map(d => ({
      ...d,
      earnedBalance: 0,
      earnedStarsBalance: 0,
    })));
    
    // Update current user balances if they are a designer
    if (currentUser.role === "designer") {
      setEarnedBalance(0);
      setEarnedStarsBalance(0);
    }
  };

  // Section management
  const addSection = (section: Omit<Section, 'id'>) => {
    const newId = `section-${Date.now()}`;
    setSections(prev => [...prev, { ...section, id: newId }]);
  };

  const updateSection = (id: string, updatedSection: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updatedSection } : s));
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    // Also delete categories and products in this section
    setCategories(prev => prev.filter(c => c.sectionId !== id));
    setProducts(prev => prev.filter(p => p.sectionId !== id));
  };

  const reorderSections = (newSections: Section[]) => {
    setSections(newSections);
  };

  // Category management
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newId = `category-${Date.now()}`;
    setCategories(prev => [...prev, { ...category, id: newId }]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Also delete products in this category
    setProducts(prev => prev.filter(p => p.categoryId !== id));
  };

  const reorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  // Product reordering
  const reorderProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Get orders for current user based on role
  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const designerOrders = orders.filter(o => o.designerId === currentUser.id);
  const allOrders = orders;

  // Notification functions
  const markChatAsOpened = (orderNumber: number) => {
    const now = Date.now();
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderNumber === orderNumber) {
          const updates: Partial<Order> = { 
            isNewChat: false,
            hasNewMessage: false, // Clear new message flag when opening chat
          };
          
          if (currentUser.role === "user") {
            updates.lastOpenedByUser = now;
          } else if (currentUser.role === "designer") {
            updates.lastOpenedByDesigner = now;
          } else if (currentUser.role === "admin") {
            updates.lastOpenedByAdmin = now;
          }
          
          return { ...order, ...updates };
        }
        return order;
      })
    );
  };

  const hasUnreadMessages = (order: Order, role: UserRole): boolean => {
    // Simply return the hasNewMessage flag
    return order.hasNewMessage || false;
  };

  const isNewChatForRole = (order: Order, role: UserRole): boolean => {
    // Check if chat has never been opened by this role
    if (role === "user") {
      return !order.lastOpenedByUser;
    } else if (role === "designer") {
      return !order.lastOpenedByDesigner;
    } else if (role === "admin") {
      return !order.lastOpenedByAdmin;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUserRole,
        getUserRole,
        sections,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        reorderProducts,
        favorites,
        toggleFavorite,
        orders: userOrders,
        createOrder,
        starsBalance,
        rublesBalance,
        adminStarsBalance,
        adminRublesBalance,
        addStarsBalance,
        addRublesBalance,
        updateOrderStatus,
        addMessage,
        confirmOrderCompletion,
        rateOrder,
        designerOrders,
        availableBalance,
        earnedBalance,
        availableStarsBalance,
        earnedStarsBalance,
        acceptOrder,
        markOrderReady,
        markOrderDisputed,
        allOrders,
        designers,
        addDesigner,
        removeDesigner,
        closeOrder,
        resolveDispute,
        payoutDesigner,
        payoutAllDesigners,
        nextPayoutDate,
        starsToRublesRate,
        markChatAsOpened,
        hasUnreadMessages,
        isNewChatForRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
