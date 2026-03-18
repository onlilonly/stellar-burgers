import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  ingredientsState,
  fetchIngredients,
  fetchIngredientsById,
  setSelectedIngredient,
  clearSelectedIngredient
} from './ingredientsSlice';

describe('проверяем редьюсер слайса ingredients', () => {
  const initialState: ingredientsState = {
    ingredients: [],
    selectedIngredient: null,
    isLoading: false,
    error: null
  };

  const testIngredient = {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: 'https://code.s3.yandex.net/react/code/core.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/core-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/core-large.png',
    __v: 0
  };

  const statePending = {
    ...initialState,
    isLoading: true
  };
  const stateFulfilled = {
    ...initialState,
    ingredients: [testIngredient]
  };
  const stateFulfilledById = {
    ...initialState,
    selectedIngredient: testIngredient
  };
  const stateRejected = {
    ...initialState,
    error: 'Не удалось загрузить ингредиенты'
  };
  const stateRejectedById = {
    ...initialState,
    error: 'Ингредиент не найден'
  };

  describe('fetchIngredients', () => {
    test('проверяем работу fetchIngredients.pending', () => {
      const newStatePending = ingredientsSlice(
        initialState,
        fetchIngredients.pending('Loading...')
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fetchIngredients.fulfilled', () => {
      const newStateFulfilled = ingredientsSlice(
        initialState,
        fetchIngredients.fulfilled([testIngredient], '')
      );
      expect(newStateFulfilled).toEqual(stateFulfilled);
    });

    test('проверяем работу fetchIngredients.rejected', () => {
      const newStateRejected = ingredientsSlice(
        initialState,
        fetchIngredients.rejected(
          new Error('Не удалось загрузить ингредиенты'),
          ''
        )
      );
      expect(newStateRejected).toEqual(stateRejected);
    });
  });

  describe('fetchIngredientsById', () => {
    test('проверяем работу fetchIngredientsById.pending', () => {
      const newStatePending = ingredientsSlice(
        initialState,
        fetchIngredientsById.pending('Loading...', '')
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fetchIngredientsById.fulfilled', () => {
      const newStateFulfilled = ingredientsSlice(
        initialState,
        fetchIngredientsById.fulfilled(testIngredient, '', '')
      );
      expect(newStateFulfilled).toEqual(stateFulfilledById);
    });

    test('проверяем работу fetchIngredientsById.rejected', () => {
      const newStateRejected = ingredientsSlice(
        initialState,
        fetchIngredientsById.rejected(new Error('Ингредиент не найден'), '', '')
      );
      expect(newStateRejected).toEqual(stateRejectedById);
    });
  });

  describe('проверяем работу редьюсеров', () => {
    test('должен добавлять выбранный ингредиент', () => {
      const newState = ingredientsSlice(
        initialState,
        setSelectedIngredient(testIngredient)
      );
      expect(newState.selectedIngredient).toEqual(testIngredient);
    });

    test('должен удалять выбранный ингредиент', () => {
      const newState = ingredientsSlice(
        initialState,
        clearSelectedIngredient()
      );
      expect(newState.selectedIngredient).toBe(null);
    });
  });
});
