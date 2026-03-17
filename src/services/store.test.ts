import { expect, test, describe, jest } from '@jest/globals';

import { rootReducer } from './store';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import feedsSlice from './feedsSlice';
import userSlice from './userSlice';

describe('проверяем начальное состояние rootReducer', () => {
  test('', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: ingredientsSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      burgerConstructor: constructorSlice(undefined, {
        type: 'UNKNOWN_ACTION'
      }),
      feeds: feedsSlice(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userSlice(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
