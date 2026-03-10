'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
  phoneModel: string;
  customName: string;
  /** Unique key = productId + phoneModel + customName */
  key: string;
}

function cartKey(productId: string, phoneModel: string, customName: string) {
  return `${productId}__${phoneModel}__${customName}`;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, phoneModel?: string, customName?: string) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, phoneModel = '', customName = '') => {
    const k = cartKey(product.id, phoneModel, customName);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === k);
      if (existing) {
        return prev.map((i) =>
          i.key === k ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, phoneModel, customName, key: k }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
