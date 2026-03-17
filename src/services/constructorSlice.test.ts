import { expect, test, describe } from '@jest/globals';

import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  ConstructorState
} from './constructorSlice';

describe('проверяем редьюсер слайса burgerConstructor', () => {
  const initialState: ConstructorState = {
    items: { bun: null, ingredients: [] },
    isLoading: false,
    error: null,
    orderConstructorData: null,
    orderFeedData: null
  };

  const bun = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  };

  const ingredientFst = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
    __v: 0
  };

  const ingredientScnd = {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    __v: 0
  };

  const ingredientThd = {
    _id: '643d69a5c3f7b9001cfa0946',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
    image_mobile:
      'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
    image_large:
      'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
    __v: 0
  };

  test('должен добавлять ингредиент', () => {
    const newState = constructorSlice(initialState, addIngredient(bun));
    const { items } = newState;
    expect(items.bun).toMatchObject({
      _id: bun._id,
      name: bun.name,
      price: bun.price
    });
    expect(items.bun?.id).toBeDefined();
  });

  test('должен удалять ингредиент', () => {
    const newState = constructorSlice(initialState, removeIngredient(bun));
    const { items } = newState;
    expect(items.bun).toBe(null);
    expect(items.bun?.id).not.toBeDefined();
  });

  test('должен менять порядок ингредиентов(учитываем, что ингредиент вставляется в центр)', () => {
    let newState = initialState;
    newState = constructorSlice(newState, addIngredient(ingredientFst));
    newState = constructorSlice(newState, addIngredient(ingredientScnd));
    newState = constructorSlice(newState, addIngredient(ingredientThd));

    expect(newState.items.ingredients[0]._id).toBe(ingredientScnd._id);
    expect(newState.items.ingredients[1]._id).toBe(ingredientThd._id);
    expect(newState.items.ingredients[2]._id).toBe(ingredientFst._id);

    newState = constructorSlice(
      newState,
      moveUpIngredient(newState.items.ingredients[1])
    );
    expect(newState.items.ingredients[0]._id).toBe(ingredientThd._id);
    expect(newState.items.ingredients[1]._id).toBe(ingredientScnd._id);
    expect(newState.items.ingredients[2]._id).toBe(ingredientFst._id);

    newState = constructorSlice(
      newState,
      moveDownIngredient(newState.items.ingredients[1])
    );
    expect(newState.items.ingredients[0]._id).toBe(ingredientThd._id);
    expect(newState.items.ingredients[1]._id).toBe(ingredientFst._id);
    expect(newState.items.ingredients[2]._id).toBe(ingredientScnd._id);
  });
});
