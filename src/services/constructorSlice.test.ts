import { expect, test, describe } from '@jest/globals';

import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  clearConstructorModal,
  clearFeedModal,
  resetConstructor,
  ConstructorState,
  createOrder,
  getOrderByNumber
} from './constructorSlice';

describe('проверяем редьюсеры слайса burgerConstructor', () => {
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
  const testOrder = {
    _id: '69b8f47ea64177001b32fe10',
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa093c'
    ],
    status: 'done',
    name: 'Био-марсианский фалленианский метеоритный краторный бургер',
    createdAt: '2026-03-17T06:28:14.750Z',
    updatedAt: '2026-03-17T06:28:15.038Z',
    number: 102937
  };
  const testOrderForApi = {
    _id: '643d69a5c3f7b9001cfa093g',
    status: 'done',
    name: 'Test Order',
    ingredients: [bun._id, ingredientFst._id, ingredientScnd._id],
    owner: {
      name: 'Тест Тестович',
      email: 'test@mail.ru',
      createdAt: '2026-03-16T12:00:00.000Z',
      updatedAt: '2026-03-16T12:00:00.000Z'
    },
    createdAt: '2026-03-16T12:00:00.000Z',
    updatedAt: '2026-03-16T12:00:00.000Z',
    number: 102920,
    price: 2934
  };
  const statePending = {
    ...initialState,
    isLoading: true
  };
  const stateFulfilled = {
    ...initialState,
    orderConstructorData: testOrderForApi
  };
  const stateRejected = {
    ...initialState,
    error: 'Не удалось создать заказ'
  };
  const stateFulfilledGetOrder = {
    ...initialState,
    orderFeedData: testOrderForApi
  };
  const stateRejectedGetOrder = {
    ...initialState,
    error: 'Не загрузить информацию о заказе'
  };

  describe('проверяем работу редьюсеров', () => {
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
      const newState = constructorSlice(
        { ...initialState, items: { bun: null, ingredients: [ingredientThd] } },
        removeIngredient(ingredientThd)
      );
      expect(newState.items.bun).toBe(null);
      expect(newState.items.bun?.id).not.toBeDefined();
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

    test('должен очищать данные модального окна созданного заказа', () => {
      const newState = constructorSlice(
        { ...initialState, orderConstructorData: testOrder },
        clearConstructorModal()
      );
      expect(newState.orderConstructorData).toBe(null);
    });

    test('должен очищать данные модального окна feeds', () => {
      const newState = constructorSlice(
        { ...initialState, orderFeedData: testOrder },
        clearFeedModal()
      );
      expect(newState.orderConstructorData).toBe(null);
    });

    test('должен очищать конструктор до исходного состояния', () => {
      let newState = initialState;
      newState = constructorSlice(newState, addIngredient(ingredientFst));
      newState = constructorSlice(newState, addIngredient(ingredientScnd));
      newState = constructorSlice(newState, addIngredient(ingredientThd));
      newState = constructorSlice(
        {
          ...initialState,
          orderFeedData: testOrder,
          orderConstructorData: testOrder
        },
        resetConstructor()
      );
      expect(newState).toEqual(initialState);
    });
  });

  describe('createOrder', () => {
    test('проверяем работу pending', () => {
      const newStatePending = constructorSlice(
        initialState,
        createOrder.pending('Loading...', [
          bun._id,
          ingredientFst._id,
          ingredientScnd._id
        ])
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = constructorSlice(
        initialState,
        createOrder.fulfilled(testOrderForApi, '', [
          bun._id,
          ingredientFst._id,
          ingredientScnd._id
        ])
      );
      expect(newStateFulfilled).toEqual(stateFulfilled);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = constructorSlice(
        initialState,
        createOrder.rejected(new Error('Не удалось создать заказ'), '', [
          bun._id,
          ingredientFst._id,
          ingredientScnd._id
        ])
      );
      expect(newStateRejected).toEqual(stateRejected);
    });
  });

  describe('getOrderByNumber', () => {
    test('проверяем работу pending', () => {
      const newStatePending = constructorSlice(
        initialState,
        getOrderByNumber.pending('Loading...', testOrderForApi.number)
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = constructorSlice(
        initialState,
        getOrderByNumber.fulfilled(testOrderForApi, '', testOrderForApi.number)
      );
      expect(newStateFulfilled).toEqual(stateFulfilledGetOrder);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = constructorSlice(
        initialState,
        getOrderByNumber.rejected(
          new Error('Не загрузить информацию о заказе'),
          '',
          testOrderForApi.number
        )
      );
      expect(newStateRejected).toEqual(stateRejectedGetOrder);
    });
  });
});
