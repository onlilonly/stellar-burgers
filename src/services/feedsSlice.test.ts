import { expect, test, describe } from '@jest/globals';
import feedsSlice, { feedsState, fetchFeeds } from './feedsSlice';

describe('проверяем редьюсер слайса feedsSlice', () => {
  const initialState: feedsState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
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

  const statePending = {
    ...initialState,
    isLoading: true
  };
  const stateFulfilled = {
    ...initialState,
    orders: [testOrder],
    total: 1,
    totalToday: 1
  };
  const stateRejected = {
    ...initialState,
    error: 'Не удалось загрузить список заказов'
  };

  test('проверяем работу pending', () => {
    const newStatePending = feedsSlice(
      initialState,
      fetchFeeds.pending('Loading...')
    );
    expect(newStatePending).toEqual(statePending);
  });

  test('проверяем работу fulfilled', () => {
    const newStateFulfilled = feedsSlice(
      initialState,
      fetchFeeds.fulfilled(
        {
          orders: [testOrder],
          total: 1,
          totalToday: 1
        },
        ''
      )
    );
    expect(newStateFulfilled).toEqual(stateFulfilled);
  });

  test('проверяем работу rejected', () => {
    const newStateRejected = feedsSlice(
      initialState,
      fetchFeeds.rejected(new Error('Не удалось загрузить список заказов'), '')
    );
    expect(newStateRejected).toEqual(stateRejected);
  });
});
