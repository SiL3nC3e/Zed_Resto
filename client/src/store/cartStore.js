import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

const normalizeId = (id) => String(id);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      discount: 0,

      addItem: (dish, quantity = 1, notes = '') => {
        const dishId = normalizeId(dish._id);
        const items = [...get().items];
        const idx = items.findIndex((i) => normalizeId(i.dishId) === dishId);
        if (idx >= 0) {
          items[idx].quantity += quantity;
          items[idx].price = dish.price;
          items[idx].image = dish.image;
          items[idx].name = dish.name;
        } else {
          items.push({
            dishId,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            quantity,
            notes,
          });
        }
        set({ items });
      },

      removeItem: (dishId) => {
        const id = normalizeId(dishId);
        set({ items: get().items.filter((i) => normalizeId(i.dishId) !== id) });
      },

      updateQuantity: (dishId, quantity) => {
        const id = normalizeId(dishId);
        if (quantity < 1) return get().removeItem(id);
        set({
          items: get().items.map((i) =>
            normalizeId(i.dishId) === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], promoCode: '', discount: 0 }),

      setPromo: (code, discount) => set({ promoCode: code, discount }),

      setItems: (items) => set({ items }),

      /** Sync cart with live menu — fixes stale IDs after DB re-seed */
      validateCart: async () => {
        const { items } = get();
        if (!items.length) return { removed: [] };

        try {
          const { data } = await api.post('/menu/validate-cart', { items });
          set({ items: data.items });
          if (get().promoCode) {
            get().setPromo('', 0);
          }
          return data;
        } catch {
          return { removed: [], error: true };
        }
      },

      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),

      total: () => Math.max(0, get().subtotal() - get().discount),

      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    {
      name: 'zed-cart',
      version: 2,
      migrate: () => ({ items: [], promoCode: '', discount: 0 }),
    }
  )
);
