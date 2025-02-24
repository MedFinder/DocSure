import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormState {
  subCategoryId: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  availableUnit: string;
  sizes: { size: string; units: number } | null;
  colors: { color: string; units: number } | null;
  base64DataImages: string[];
}

const initialState: FormState = {
  subCategoryId: 0,
  categoryId: 0,
  name: "",
  description: "",
  price: "",
  availableUnit: "",
  sizes: null,
  colors: null,
  base64DataImages: [],
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<FormState>) {
      state.subCategoryId = action.payload.subCategoryId;
      state.categoryId = action.payload.categoryId;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.price = action.payload.price;
      state.availableUnit = action.payload.availableUnit;
      state.sizes = action.payload.sizes;
      state.colors = action.payload.colors;
      state.base64DataImages = action.payload.base64DataImages;
    },
    clearFormData(state) {
      state.subCategoryId = initialState.subCategoryId;
      state.categoryId = initialState.categoryId;
      state.name = initialState.name;
      state.description = initialState.description;
      state.price = initialState.price;
      state.availableUnit = initialState.availableUnit;
      state.sizes = initialState.sizes;
      state.colors = initialState.colors;
      state.base64DataImages = initialState.base64DataImages;
    },
  },
});

export const { setFormData, clearFormData } = formSlice.actions;
export default formSlice.reducer;
