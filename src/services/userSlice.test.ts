import { expect, test, describe } from '@jest/globals';
import userSlice, {
  userState,
  authChecked,
  getUser,
  registerUser,
  updateUser,
  loginUser,
  logoutUser,
  getUserOrders
} from './userSlice';

describe('проверяем редьюсеры слайса user', () => {
  const initialState: userState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null,
    orders: [],
    ordersLoading: false,
    ordersError: null
  };

  const testUser = {
    email: 'test@mail.ru',
    name: 'Тест Тестович',
    password: '123456789'
  };
  const updatedUser = {
    email: 'test@mail.ru',
    name: 'Тестик Тестович',
    password: '123456789'
  };

  const testOrder = {
    _id: '69b8f47ea64177001b32fe10',
    status: 'done',
    name: 'Био-марсианский фалленианский метеоритный краторный бургер',
    createdAt: '2026-03-17T06:28:14.750Z',
    updatedAt: '2026-03-17T06:28:15.038Z',
    number: 102937,
    ingredients: [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0941',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0940',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa0947',
      '643d69a5c3f7b9001cfa093c'
    ]
  };

  const registerResponse = {
    success: true,
    accessToken: 'Bearer testAccessToken',
    refreshToken: 'testRefreshToken',
    user: testUser
  };

  const statePending = {
    ...initialState,
    isLoading: true
  };
  const stateFulfilledGetUser = {
    ...initialState,
    user: testUser,
    isLoading: false
  };
  const stateRejectedGetUser = {
    ...initialState,
    isLoading: false,
    error: 'Не удалось получить данные о пользователе'
  };
  const stateFulfilledRegister = {
    ...initialState,
    user: testUser,
    isLoading: false
  };
  const stateRejectedRegister = {
    ...initialState,
    isLoading: false,
    error: 'Не удалось зарегистрировать пользователя'
  };
  const stateFulfilledUpdate = {
    ...initialState,
    user: updatedUser,
    isLoading: false
  };
  const stateRejectedUpdate = {
    ...initialState,
    isLoading: false,
    error: 'Не удалось изменить данные пользователя'
  };
  const stateRejectedLogin = {
    ...initialState,
    isLoading: false,
    error: 'Не удалось войти в учетную запись'
  };
  const stateRejectedLogout = {
    ...initialState,
    isLoading: false,
    error: 'Не удалось выйти из учетной записи'
  };
  const statePendingOrders = {
    ...initialState,
    ordersLoading: true,
    isLoading: false
  };
  const stateFulfilledOrders = {
    ...initialState,
    ordersLoading: false,
    isLoading: false,
    orders: [testOrder]
  };
  const stateRejectedOrders = {
    ...initialState,
    ordersLoading: false,
    isLoading: false,
    ordersError: 'Не удалось загрузить заказы пользователя'
  };

  describe('проверяем работу редьюсеров', () => {
    test('проверка авторизации', () => {
      const newState = userSlice(initialState, authChecked());
      expect(newState.isAuthChecked).toBe(true);
    });
  });

  describe('getUser', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        getUser.pending('Loading...')
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = userSlice(
        initialState,
        getUser.fulfilled(testUser, '')
      );
      expect(newStateFulfilled).toEqual(stateFulfilledGetUser);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        getUser.rejected(
          new Error('Не удалось получить данные о пользователе'),
          ''
        )
      );
      expect(newStateRejected).toEqual(stateRejectedGetUser);
    });
  });

  describe('registerUser', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        registerUser.pending('Loading...', testUser)
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = userSlice(
        initialState,
        registerUser.fulfilled(registerResponse, '', testUser)
      );
      expect(newStateFulfilled).toEqual(stateFulfilledRegister);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        registerUser.rejected(
          new Error('Не удалось зарегистрировать пользователя'),
          '',
          testUser
        )
      );
      expect(newStateRejected).toEqual(stateRejectedRegister);
    });
  });

  describe('updateUser', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        updateUser.pending('Loading...', updatedUser)
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const state = userSlice(
        initialState,
        registerUser.fulfilled(registerResponse, '', testUser)
      );
      const newStateFulfilled = userSlice(
        initialState,
        updateUser.fulfilled(updatedUser, '', updatedUser)
      );
      expect(newStateFulfilled).toEqual(stateFulfilledUpdate);
      expect(newStateFulfilled).not.toEqual(state);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        updateUser.rejected(
          new Error('Не удалось изменить данные пользователя'),
          '',
          updatedUser
        )
      );
      expect(newStateRejected).toEqual(stateRejectedUpdate);
    });
  });

  describe('loginUser', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        loginUser.pending('Loading...', testUser)
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = userSlice(
        initialState,
        loginUser.fulfilled(registerResponse, '', testUser)
      );
      expect(newStateFulfilled).toEqual(stateFulfilledRegister);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        loginUser.rejected(
          new Error('Не удалось войти в учетную запись'),
          '',
          testUser
        )
      );
      expect(newStateRejected).toEqual(stateRejectedLogin);
    });
  });

  describe('logoutUser', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        logoutUser.pending('Loading...')
      );
      expect(newStatePending).toEqual(statePending);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = userSlice(
        initialState,
        logoutUser.fulfilled(undefined, '')
      );
      expect(newStateFulfilled).toEqual(initialState);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        logoutUser.rejected(new Error('Не удалось выйти из учетной записи'), '')
      );
      expect(newStateRejected).toEqual(stateRejectedLogout);
    });
  });

  describe('getUserOrders', () => {
    test('проверяем работу pending', () => {
      const newStatePending = userSlice(
        initialState,
        getUserOrders.pending('Loading...')
      );
      expect(newStatePending).toEqual(statePendingOrders);
    });

    test('проверяем работу fulfilled', () => {
      const newStateFulfilled = userSlice(
        initialState,
        getUserOrders.fulfilled([testOrder], '')
      );
      expect(newStateFulfilled).toEqual(stateFulfilledOrders);
    });

    test('проверяем работу rejected', () => {
      const newStateRejected = userSlice(
        initialState,
        getUserOrders.rejected(
          new Error('Не удалось загрузить заказы пользователя'),
          ''
        )
      );
      expect(newStateRejected).toEqual(stateRejectedOrders);
    });
  });
});
