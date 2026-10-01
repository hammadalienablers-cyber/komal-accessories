import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, ProductCategory } from '../types';
import { PRODUCTS } from '../data/products';

interface ShopContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Coupon
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Tracking
  orders: Order[];
  placeOrder: (orderInfo: {
    customerName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
    paymentMethod: 'cod' | 'card' | 'jazzcash_easypaisa';
  }) => Order;
  getOrderById: (query: string) => Order | undefined;
  trackOrderId: string;
  setTrackOrderId: (id: string) => void;

  // Navigation & Modals
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeProduct: Product | null;
  setActiveProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  openOrderTrackerWithId: (orderId?: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Initial demo order for instant tracking test
const INITIAL_DEMO_ORDER: Order = {
  id: 'KA-84920',
  trackingNumber: 'TRX-94827104PK',
  customerName: 'Aiman Zahra',
  email: 'aiman.zahra@example.com',
  phone: '0302-8472910',
  city: 'Lahore',
  address: 'House #42, Block D, Model Town',
  postalCode: '54700',
  notes: 'Please ring bell twice, call before delivery.',
  items: [
    {
      product: PRODUCTS[0],
      quantity: 1,
      selectedColor: 'Lilac Shimmer',
    },
    {
      product: PRODUCTS[1],
      quantity: 1,
      selectedColor: 'Pure White Shell',
    },
  ],
  subtotal: 2100,
  shipping: 0,
  discount: 210,
  total: 1890,
  paymentMethod: 'cod',
  paymentStatus: 'pending',
  courierName: 'Trax Express Logistics',
  orderStatus: 'out_for_delivery',
  createdAt: '28 Sep 2026, 02:40 PM',
  estimatedDelivery: 'Today by 5:00 PM',
  timeline: [
    {
      status: 'placed',
      label: 'Order Placed & Confirmed',
      description: 'Your order was verified by Komal Customer Care.',
      timestamp: '28 Sep 2026, 02:45 PM',
      completed: true,
      current: false,
    },
    {
      status: 'packed',
      label: 'Quality Checked & Gift Packed',
      description: 'Items wrapped in blush tissue and satin gift ribbon with seal.',
      timestamp: '28 Sep 2026, 05:10 PM',
      completed: true,
      current: false,
    },
    {
      status: 'dispatched',
      label: 'Dispatched via Trax Express',
      description: 'Handed over to Trax Central Hub Lahore (Waybill # TRX-94827104PK).',
      timestamp: '29 Sep 2026, 09:15 AM',
      completed: true,
      current: false,
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery in Lahore',
      description: 'Courier Rider (Hamza Ali, Contact: 0312-9847162) is on the way.',
      timestamp: '29 Sep 2026, 11:30 AM',
      completed: true,
      current: true,
    },
    {
      status: 'delivered',
      label: 'Delivered & Signed',
      description: 'Package handed over and payment received upon delivery.',
      timestamp: 'Estimated: Today, 04:30 PM',
      completed: false,
      current: false,
    },
  ],
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('komal_cart');
      return saved ? JSON.parse(saved) : [
        // Seed 1 default item to show instant value in cart drawer
        {
          product: PRODUCTS[0],
          quantity: 1,
          selectedColor: PRODUCTS[0].colors[0].name,
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('komal_wishlist');
      return saved ? JSON.parse(saved) : ['ka-jewel-01', 'ka-gift-01'];
    } catch {
      return ['ka-jewel-01'];
    }
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('komal_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [INITIAL_DEMO_ORDER];
      }
      return [INITIAL_DEMO_ORDER];
    } catch {
      return [INITIAL_DEMO_ORDER];
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Modals & Navigation state
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [trackOrderId, setTrackOrderId] = useState<string>('KA-84920');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('komal_cart', JSON.stringify(cart));
    } catch {
      // Storage unavailable or quota
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('komal_wishlist', JSON.stringify(wishlist));
    } catch {
      // Storage unavailable or quota
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('komal_orders', JSON.stringify(orders));
    } catch {
      // Storage unavailable or quota
    }
  }, [orders]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === selectedColor) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Coupon calculations
  const discountAmount = appliedCoupon === 'KOMAL10' 
    ? Math.round(cartSubtotal * 0.1) 
    : appliedCoupon === 'FREESHIP' 
    ? 200 
    : 0;

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'KOMAL10') {
      setAppliedCoupon('KOMAL10');
      return { success: true, message: '🎉 10% Special Discount Applied!' };
    }
    if (trimmed === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      return { success: true, message: '🚚 Free Express Shipping Applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try "KOMAL10" or "FREESHIP".' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Place Order
  const placeOrder = (orderInfo: {
    customerName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
    paymentMethod: 'cod' | 'card' | 'jazzcash_easypaisa';
  }): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `KA-${randomSuffix}`;
    const trackingNo = `TRX-${Math.floor(100000000 + Math.random() * 900000000)}PK`;

    const freeShippingThreshold = 2000;
    const baseShipping = cartSubtotal >= freeShippingThreshold || appliedCoupon === 'FREESHIP' ? 0 : 200;
    const discount = discountAmount;
    const grandTotal = Math.max(0, cartSubtotal + baseShipping - discount);

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: newOrderId,
      trackingNumber: trackingNo,
      customerName: orderInfo.customerName,
      email: orderInfo.email,
      phone: orderInfo.phone,
      city: orderInfo.city,
      address: orderInfo.address,
      postalCode: orderInfo.postalCode,
      notes: orderInfo.notes,
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: baseShipping,
      discount: discount,
      total: grandTotal,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: orderInfo.paymentMethod === 'card' ? 'paid' : 'pending',
      courierName: 'Trax / Leopards Express',
      orderStatus: 'placed',
      createdAt: formattedDate,
      estimatedDelivery: 'Within 2-3 Business Days',
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed & Confirmed',
          description: 'Your order was received and queued for bespoke packaging.',
          timestamp: formattedDate,
          completed: true,
          current: true,
        },
        {
          status: 'packed',
          label: 'Quality Check & Satin Packaging',
          description: 'Each piece inspected for premium finish and packaged in gift box.',
          timestamp: 'Pending packaging',
          completed: false,
          current: false,
        },
        {
          status: 'dispatched',
          label: 'Dispatched with Courier',
          description: `Will be handed to Leopards / Trax Express with tracking ${trackingNo}.`,
          timestamp: 'Scheduled tomorrow morning',
          completed: false,
          current: false,
        },
        {
          status: 'out_for_delivery',
          label: `Out for Delivery in ${orderInfo.city}`,
          description: 'Local rider assigned for doorstep delivery with cash receipt.',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          description: 'Package safely delivered to your doorstep.',
          timestamp: 'Pending delivery',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setTrackOrderId(newOrderId);
    return newOrder;
  };

  const getOrderById = (query: string): Order | undefined => {
    const q = query.trim().toUpperCase();
    if (!q) return undefined;
    return orders.find(
      (o) =>
        o.id.toUpperCase() === q ||
        o.trackingNumber.toUpperCase() === q ||
        o.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
    );
  };

  const openOrderTrackerWithId = (orderId?: string) => {
    if (orderId) {
      setTrackOrderId(orderId);
    }
    setIsTrackOrderOpen(true);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        getOrderById,
        trackOrderId,
        setTrackOrderId,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        activeProduct,
        setActiveProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        openOrderTrackerWithId,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
