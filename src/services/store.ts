import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import feedsSlice from './feedsSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { BurgerConstructor } from '@components';

// const rootReducer = () => {
//   ingredients: ingredientsSlice;
// }; // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    burgerConstructor: constructorSlice,
    feeds: feedsSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
