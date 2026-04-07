import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeAll: () => void;
}

const useCart = create<CartStore>()(
  persist((set, get) => ({
    items: [],
    addItem: (data: Product) => {
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === data.id);
      
      if (existingItem) {
        return set({
          items: currentItems.map((item) =>
            item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        });
      }

      set({ items: [...get().items, { ...data, quantity: 1 }] });
      toast.success("Đã thêm vào giỏ hàng.");
    },
    removeItem: (id: string) => {
      set({ items: get().items.filter((item) => item.id !== id) });
    },
    updateQuantity: (id: string, quantity: number) => {
      set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      });
    },
    removeAll: () => set({ items: [] }),
  }), {
    name: 'cart-storage',
    storage: createJSONStorage(() => localStorage),
  })
);

export default useCart;