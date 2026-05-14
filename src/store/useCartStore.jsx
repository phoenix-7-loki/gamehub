import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (game) => {
        set(produce((state) => {
          const existing = state.items.find(item => item.id === game.id);
          if (existing) {
            existing.quantity += 1;
          } else {
            state.items.push({ ...game, quantity: 1 });
          }
        }));
      },
      
      removeItem: (id) => {
        set(produce((state) => {
          const index = state.items.findIndex(item => item.id === id);
          if (index !== -1) state.items.splice(index, 1);
        }));
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set(produce((state) => {
          const item = state.items.find(item => item.id === id);
          if (item) item.quantity = quantity;
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;