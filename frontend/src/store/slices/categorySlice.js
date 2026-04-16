import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCategory,
  getAllCategories,
  getMainCategories,
  getSubcategoriesByParent,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";


export const createCategoryThunk = createAsyncThunk(
  "category/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCategory(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);

export const getAllCategoriesThunk = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const getMainCategoriesThunk = createAsyncThunk(
  "category/getMainCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMainCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch main categories"
      );
    }
  }
);

export const getSubcategoriesByParentThunk = createAsyncThunk(
  "category/getSubcategoriesByParent",
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await getSubcategoriesByParent(parentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  }
);

export const getCategoryByIdThunk = createAsyncThunk(
  "category/getCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCategoryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch category"
      );
    }
  }
);
export const updateCategoryThunk = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateCategory(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update category"
      );
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteCategory(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  }
);

const initialState = {
  categories: [],
  mainCategories: [],
  subcategories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  success: false,
  message: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearSubcategories: (state) => {
      state.subcategories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        if (action.payload.data) {
          state.categories.push(action.payload.data);
          if (action.payload.data.parent_id === null) {
            state.mainCategories.push(action.payload.data);
          }
        }
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(getAllCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMainCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMainCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.mainCategories = action.payload.data || [];
      })
      .addCase(getMainCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSubcategoriesByParentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubcategoriesByParentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload.data || [];
      })
      .addCase(getSubcategoriesByParentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCategoryByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload.data || null;
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        const updatedCategory = action.payload.data;

        state.categories = state.categories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );

        state.mainCategories = state.mainCategories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );

        state.subcategories = state.subcategories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        );

        if (state.selectedCategory?.id === updatedCategory.id) {
          state.selectedCategory = updatedCategory;
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload.id
        );
        state.mainCategories = state.mainCategories.filter(
          (cat) => cat.id !== action.payload.id
        );
        state.subcategories = state.subcategories.filter(
          (cat) => cat.id !== action.payload.id
        );

        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearCategoryState,
  clearSelectedCategory,
  clearSubcategories,
} = categorySlice.actions;

export default categorySlice.reducer;