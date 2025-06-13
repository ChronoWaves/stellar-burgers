import feedReducer, {
  getFeeds,
  initialState,
  getFeedState
} from './feedSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';
import { TOrder } from '@utils-types';
import type { RootState } from '../store';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const createMockOrder = (
  id: string,
  number: number,
  name: string,
  status: 'done' | 'pending' | 'created',
  ingredients: string[]
): TOrder => ({
  _id: id,
  number,
  name,
  status,
  ingredients,
  createdAt: '2024-04-20T10:00:00.000Z',
  updatedAt: '2024-04-20T10:01:00.000Z'
});

describe('feedSlice', () => {
  let baseState: TFeedState;
  let mockOrders: TOrder[];

  beforeEach(() => {
    baseState = { ...initialState };

    mockOrders = [
      createMockOrder('order1', 12345, 'burger', 'done', ['ingredient1', 'ingredient2']),
      createMockOrder('order2', 12346, 'sandwich', 'pending', ['ingredient3', 'ingredient4', 'ingredient5']),
      createMockOrder('order3', 12347, 'wrap', 'created', ['ingredient6'])
    ];
  });

  describe('Начальное состояние', () => {
    test('возвращается при неизвестном действии', () => {
      const state = feedReducer(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Обработка getFeeds', () => {
    describe('Запрос данных', () => {
      test('при запуске включается индикатор загрузки и очищается ошибка', () => {
        const state = feedReducer(baseState, { type: getFeeds.pending.type });

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.orders).toEqual([]);
        expect(state.total).toBe(0);
        expect(state.totalToday).toBe(0);
      });

      test('при повторной загрузке данные остаются без изменений', () => {
        const stateWithData: TFeedState = {
          ...baseState,
          orders: mockOrders,
          total: 100,
          totalToday: 10
        };

        const state = feedReducer(stateWithData, { type: getFeeds.pending.type });

        expect(state.loading).toBe(true);
        expect(state.orders).toEqual(mockOrders);
        expect(state.total).toBe(100);
        expect(state.totalToday).toBe(10);
      });
    });

    describe('Успешная загрузка', () => {
      test('при пустом списке данные обнуляются', () => {
        const state = feedReducer(baseState, {
          type: getFeeds.fulfilled.type,
          payload: {
            orders: [],
            total: 0,
            totalToday: 0
          }
        });

        expect(state.loading).toBe(false);
        expect(state.orders).toEqual([]);
        expect(state.total).toBe(0);
        expect(state.totalToday).toBe(0);
        expect(state.error).toBeNull();
      });

      test('при наличии заказов список обновляется', () => {
        const state = feedReducer(baseState, {
          type: getFeeds.fulfilled.type,
          payload: {
            orders: mockOrders,
            total: 150,
            totalToday: 25
          }
        });

        expect(state.orders).toEqual(mockOrders);
        expect(state.total).toBe(150);
        expect(state.totalToday).toBe(25);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });

      test('новые данные полностью заменяют старые', () => {
        const previousState: TFeedState = {
          ...baseState,
          orders: [mockOrders[0]],
          total: 50,
          totalToday: 5
        };

        const newOrders = [mockOrders[1], mockOrders[2]];

        const state = feedReducer(previousState, {
          type: getFeeds.fulfilled.type,
          payload: {
            orders: newOrders,
            total: 200,
            totalToday: 30
          }
        });

        expect(state.orders).toEqual(newOrders);
        expect(state.total).toBe(200);
        expect(state.totalToday).toBe(30);
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('Ошибка при загрузке', () => {
      test('при ошибке сеть не очищается, сообщение сохраняется', () => {
        const error = 'Ошибка сети';
        const state = feedReducer(baseState, {
          type: getFeeds.rejected.type,
          error: { message: error }
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
        expect(state.orders).toEqual([]);
      });

      test('при наличии данных они сохраняются', () => {
        const stateWithData: TFeedState = {
          ...baseState,
          orders: mockOrders,
          total: 100,
          totalToday: 10
        };

        const error = 'Ошибка загрузки заказов';
        const state = feedReducer(stateWithData, {
          type: getFeeds.rejected.type,
          error: { message: error }
        });

        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
        expect(state.orders).toEqual(mockOrders);
        expect(state.total).toBe(100);
        expect(state.totalToday).toBe(10);
      });
    });
  });

  describe('Селекторы', () => {
    test('getFeedState возвращает состояние feed из RootState', () => {
      const mockState = {
        feed: {
          ...baseState,
          orders: mockOrders,
          total: 100,
          totalToday: 10
        }
      } as RootState;

      const selected = getFeedState(mockState);
      expect(selected).toEqual(mockState.feed);
    });

    test('обработка пустого состояния', () => {
      const mockState = { feed: baseState } as RootState;
      expect(getFeedState(mockState)).toEqual(baseState);
    });

    test('возвращает состояние загрузки', () => {
      const mockState = {
        feed: { ...baseState, loading: true }
      } as RootState;

      expect(getFeedState(mockState).loading).toBe(true);
    });

    test('возвращает сообщение об ошибке', () => {
      const mockState = {
        feed: { ...baseState, error: 'Ошибка теста' }
      } as RootState;

      expect(getFeedState(mockState).error).toBe('Ошибка теста');
    });
  });
});
