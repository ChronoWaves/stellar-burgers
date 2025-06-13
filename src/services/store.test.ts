import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './store';
import constructorSlice from './slices/constructorSlice';
import ingredientSlice from './slices/ingredientSlice';
import userSlice from './slices/userSlice';
import feedSlice from './slices/feedSlice';
import orderSlice from './slices/orderSlice';

describe('Конфигурация Redux-хранилища', () => {
  const createTestStore = () =>
    configureStore({
      reducer: rootReducer,
      devTools: process.env.NODE_ENV !== 'production'
    });

  describe('Инициализация', () => {
    test('возвращает корректное начальное состояние', () => {
      const store = createTestStore();
      expect(store.getState()).toBeDefined();
    });

    test('включает все ожидаемые редьюсеры', () => {
      const state = createTestStore().getState();
      expect(state).toHaveProperty('constructorBurger');
      expect(state).toHaveProperty('ingredient');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('feed');
      expect(state).toHaveProperty('order');
    });
  });

  describe('Интеграция редьюсеров', () => {
    test('собирает корректную структуру из отдельных срезов', () => {
      const testStore = configureStore({
        reducer: {
          constructorBurger: constructorSlice,
          ingredient: ingredientSlice,
          user: userSlice,
          feed: feedSlice,
          order: orderSlice
        }
      });

      const expectedState = createTestStore().getState();
      expect(testStore.getState()).toEqual(expectedState);
    });

    test('поддерживает изолированное состояние каждого редьюсера', () => {
      const testAction = { type: 'UNKNOWN_ACTION' };
      const store = createTestStore();
      const stateBefore = store.getState();
      store.dispatch(testAction);
      const stateAfter = store.getState();

      expect(stateAfter.constructorBurger).toEqual(stateBefore.constructorBurger);
      expect(stateAfter.ingredient).toEqual(stateBefore.ingredient);
      expect(stateAfter.user).toEqual(stateBefore.user);
      expect(stateAfter.feed).toEqual(stateBefore.feed);
      expect(stateAfter.order).toEqual(stateBefore.order);
    });
  });

  describe('Обновление состояния', () => {
    test('обновляет только указанные части состояния', () => {
      const originalState = createTestStore().getState();

      const modifiedStore = configureStore({
        reducer: rootReducer,
        preloadedState: {
          ...originalState,
          user: {
            ...originalState.user,
            userData: { name: 'Name', email: 'test@example.com' }
          }
        }
      });

      expect(modifiedStore.getState().user.userData).toEqual({
        name: 'Name',
        email: 'test@example.com'
      });

      expect(modifiedStore.getState().constructorBurger).toEqual(originalState.constructorBurger);
      expect(modifiedStore.getState().ingredient).toEqual(originalState.ingredient);
    });

    test('сохраняет форму состояния между экземплярами стора', () => {
      const expectedShape = {
        constructorBurger: expect.any(Object),
        ingredient: expect.any(Object),
        user: expect.any(Object),
        feed: expect.any(Object),
        order: expect.any(Object)
      };

      const currentState = createTestStore().getState();
      expect(currentState).toMatchObject(expectedShape);
    });
  });

  describe('Обработка некорректных действий', () => {
    test('игнорирует действие с некорректной структурой', () => {
      const store = createTestStore();
      const stateBefore = store.getState();

      const malformedAction = {
        type: 'TEST_MALFORMED_ACTION',
        payload: undefined
      };

      store.dispatch(malformedAction);
      expect(store.getState()).toEqual(stateBefore);
    });

    test('не изменяет состояние при неизвестных действиях', () => {
      const store = createTestStore();
      const stateBefore = store.getState();

      const invalidAction = {
        type: 'UNKNOWN_TYPE',
        payload: 'Некорректные данные'
      };

      store.dispatch(invalidAction);
      expect(store.getState()).toEqual(stateBefore);
    });
  });
});
