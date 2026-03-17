import { expect, test, describe } from '@jest/globals';
import ingredientsSlice, {
  ingredientsState,
  fetchIngredients,
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
  const stateRejected = {
    ...initialState,
    error: 'Не удалось загрузить ингредиенты'
  };

  test('проверяем работу pending', () => {
    const newStatePending = ingredientsSlice(
      initialState,
      fetchIngredients.pending('Loading...')
    );
    expect(newStatePending).toEqual(statePending);
  });

  test('проверяем работу fulfilled', () => {
    const newStateFulfilled = ingredientsSlice(
      initialState,
      fetchIngredients.fulfilled([testIngredient], '')
    );
    expect(newStateFulfilled).toEqual(stateFulfilled);
  });

  test('проверяем работу rejected', () => {
    const newStateRejected = ingredientsSlice(
      initialState,
      fetchIngredients.rejected(
        new Error('Не удалось загрузить ингредиенты'),
        ''
      )
    );
    expect(newStateRejected).toEqual(stateRejected);
  });

  test('должен добавлять выбранный ингредиент', () => {
    const newState = ingredientsSlice(
      initialState,
      setSelectedIngredient(testIngredient)
    );
    expect(newState.selectedIngredient).toEqual(testIngredient);
  });

  test('должен удалять выбранный ингредиент', () => {
    const newState = ingredientsSlice(initialState, clearSelectedIngredient());
    expect(newState.selectedIngredient).toBe(null);
  });
});
