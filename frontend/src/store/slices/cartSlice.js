import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "cart";

const readFromStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const writeToStorage = (items) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const normalizeItem = (payload) => {
  const id = payload?._id || payload?.id;

  const rawPrice = payload?.price;
  const price =
    typeof rawPrice === "number"
      ? rawPrice
      : Number(String(rawPrice || "").replace(/[^0-9.]/g, "")) || 0;

  const rawMin = payload?.minQty || payload?.min; // ✅ FIX
  const moq = Math.max(
    1,
    Number(String(rawMin || "").replace(/[^0-9.]/g, "")) || 1
  );

  return {
    _id: id,
    name: payload?.name || payload?.title || "",
    image: payload?.image || "",
    price,
    min: `Min. ${moq} units`, // ✅ FIX (consistent)
    moq,
    quantity: payload?.quantity || moq,
  };
};


const normalizeStoredItems = (items) => {
  const list = Array.isArray(items) ? items : [];
  return list
    .map((x) => {
      const id = x?._id || x?.id;

      const price =
        typeof x?.price === "number"
          ? x.price
          : Number(String(x?.price || "").replace(/[^0-9.]/g, "")) || 0;

      const moq = Math.max(
        1,
        Number(String(x?.moq || x?.min || "").replace(/[^0-9.]/g, "")) || 1
      );

      const qty =
        typeof x?.quantity === "number"
          ? x.quantity
          : Number(String(x?.quantity || "").replace(/[^0-9.]/g, "")) || moq;

      return {
        _id: id,
        name: x?.name || x?.title || "",
        image: x?.image || "",
        price,
        min: x?.min || `Min. ${moq} units`,
        moq,
        quantity: qty < moq ? moq : qty,
      };
    })
    .filter((x) => Boolean(x._id));
};

const initialState = {
  items: readFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      state.items = normalizeStoredItems(readFromStorage());
      writeToStorage(state.items);
    },

    addToCart: (state, action) => {
      const item = normalizeItem(action.payload);
      if (!item._id) return;

      const existing = state.items.find((x) => x._id === item._id);

      if (existing) {
        existing.quantity += item.moq; // ✅ FIX
      } else {
        state.items.push(item);
      }

      writeToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((x) => x._id !== id);
      writeToStorage(state.items);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((x) => x._id === id);
      if (item) {
        item.quantity += item.moq; // ✅ FIX
      }
      writeToStorage(state.items);
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((x) => x._id === id);

      if (item) {
        const minQty = item.moq || 1;
        const nextQty = item.quantity - item.moq; // ✅ FIX
        item.quantity = nextQty < minQty ? minQty : nextQty;
      }

      writeToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      writeToStorage([]);
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;