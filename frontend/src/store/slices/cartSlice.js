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

const normalizeNumber = (value, fallback = 0) => {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isNaN(parsed) ? fallback : parsed;
};

const normalizeMOQ = (payload) => {
  const rawMin =
    payload?.moq ??
    payload?.minQty ??
    payload?.minimumOrderQuantity ??
    payload?.min;

  if (typeof rawMin === "number" && !Number.isNaN(rawMin)) {
    return Math.max(1, rawMin);
  }

  const parsed = Number(String(rawMin || "").replace(/[^0-9.]/g, ""));
  return Math.max(1, parsed || 1);
};

const normalizeItem = (payload) => {
  const id = payload?._id || payload?.id;
  const price = normalizeNumber(payload?.price, 0);
  const moq = normalizeMOQ(payload);

  const quantity =
    payload?.quantity != null
      ? Math.max(moq, Math.floor(normalizeNumber(payload.quantity, moq)))
      : moq;

  return {
    _id: id,
    name: payload?.name || payload?.title || "",
    image: payload?.image || "",
    price,
    min: `Min. ${moq} units`,
    moq,
    quantity,

    size: payload?.size || null,
    color: payload?.color || null,
    deliveryDate: payload?.deliveryDate || null,

    category: payload?.category || null,
    specifications: payload?.specifications || null,
  };
};

const normalizeStoredItems = (items) => {
  const list = Array.isArray(items) ? items : [];

  return list
    .map((x) => {
      const id = x?._id || x?.id;
      const price = normalizeNumber(x?.price, 0);
      const moq = normalizeMOQ(x);
      const qty = normalizeNumber(x?.quantity, moq);

      return {
        _id: id,
        name: x?.name || x?.title || "",
        image: x?.image || "",
        price,
        min: x?.min || `Min. ${moq} units`,
        moq,
        quantity: qty < moq ? moq : Math.floor(qty),

        size: x?.size || null,
        color: x?.color || null,
        deliveryDate: x?.deliveryDate || null,

        category: x?.category || null,
        specifications: x?.specifications || null,
      };
    })
    .filter((x) => Boolean(x._id));
};

const isSameCartItem = (a, b) => {
  return (
    a._id === b._id &&
    (a.size || null) === (b.size || null) &&
    (a.color || null) === (b.color || null) &&
    (a.deliveryDate || null) === (b.deliveryDate || null)
  );
};

const initialState = {
  items: normalizeStoredItems(readFromStorage()),
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

      const existing = state.items.find((x) => isSameCartItem(x, item));

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: item.moq,
        });
      }

      writeToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const payload = action.payload;

      state.items = state.items.filter((item) => {
        if (typeof payload === "string") {
          return item._id !== payload;
        }
        return !isSameCartItem(item, payload);
      });

      writeToStorage(state.items);
    },

    increaseQuantity: (state, action) => {
      const payload = action.payload;

      const item = state.items.find((x) => {
        if (typeof payload === "string") {
          return x._id === payload;
        }
        return isSameCartItem(x, payload);
      });

      if (item) {
        item.quantity += 1;
      }

      writeToStorage(state.items);
    },

    decreaseQuantity: (state, action) => {
      const payload = action.payload;

      const item = state.items.find((x) => {
        if (typeof payload === "string") {
          return x._id === payload;
        }
        return isSameCartItem(x, payload);
      });

      if (item) {
        const moq = item.moq || 1;
        if (item.quantity > moq) {
          item.quantity -= 1;
        }
      }

      writeToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, size, color, deliveryDate, quantity } = action.payload;

      const item = state.items.find(
        (x) =>
          x._id === id &&
          (x.size || null) === (size || null) &&
          (x.color || null) === (color || null) &&
          (x.deliveryDate || null) === (deliveryDate || null)
      );

      if (item) {
        const moq = item.moq || 1;
        const parsedQty = Number(quantity);

        if (Number.isNaN(parsedQty)) {
          item.quantity = moq;
        } else {
          item.quantity = parsedQty < moq ? moq : Math.floor(parsedQty);
        }
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
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;