import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "favourites";

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
  } catch {
    // ignore
  }
};

const normalizeItem = (payload) => {
  const id = payload?._id || payload?.id;
  return {
    _id: id,
    name: payload?.name || payload?.title || "",
    image: payload?.image || "",
    price: payload?.price || "",
  };
};

const initialState = {
  items: readFromStorage(),
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    hydrateFavourites: (state) => {
      state.items = readFromStorage();
    },

    addFavourite: (state, action) => {
      const item = normalizeItem(action.payload);
      if (!item._id) return;
      const exists = state.items.some((x) => x._id === item._id);
      if (exists) return;
      state.items = [...state.items, item];
      writeToStorage(state.items);
    },

    removeFavourite: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((x) => x._id !== id);
      writeToStorage(state.items);
    },

    toggleFavourite: (state, action) => {
      const item = normalizeItem(action.payload);
      if (!item._id) return;
      const exists = state.items.some((x) => x._id === item._id);
      state.items = exists
        ? state.items.filter((x) => x._id !== item._id)
        : [...state.items, item];
      writeToStorage(state.items);
    },

    clearFavourites: (state) => {
      state.items = [];
      writeToStorage([]);
    },
  },
});

export const {
  hydrateFavourites,
  addFavourite,
  removeFavourite,
  toggleFavourite,
  clearFavourites,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
