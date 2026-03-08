import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';
import { stat } from 'fs';

type ConstructorState = {
  items: {
    ingredients: TConstructorIngredient[];
    bun: TConstructorIngredient | null;
  };
  isLoading: boolean;
  error: string | null;
};

const initialState: ConstructorState = {
  items: { bun: null, ingredients: [] },
  isLoading: false,
  error: null
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.items.bun = { ...item, id: uuid() };
      } else {
        state.items.ingredients.splice(
          Math.floor(state.items.ingredients.length / 2),
          0,
          { ...item, id: uuid() }
        );
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.items.ingredients = state.items.ingredients.filter(
        (elem) => elem.id !== action.payload.id
      );
    },
    moveUpIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.items.ingredients.findIndex(
        (elem) => elem.id === action.payload.id
      );
      const deletedElem = state.items.ingredients.splice(index, 1)[0];
      state.items.ingredients.splice(index - 1, 0, deletedElem);
    },
    moveDownIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.items.ingredients.findIndex(
        (elem) => elem.id === action.payload.id
      );
      const deletedElem = state.items.ingredients.splice(index, 1)[0];
      state.items.ingredients.splice(index + 1, 0, deletedElem);
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient
} = constructorSlice.actions;
export default constructorSlice.reducer;
