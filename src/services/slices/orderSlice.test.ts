import orderSlice, {
  initialState,
  getOrderByNumber,
  getOrderState
} from './orderSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { expect, test, describe, beforeEach } from '@jest/globals';

jest.mock('../../utils/burger-api');
const mockedGetOrderByNumberApi = getOrderByNumberApi as jest.MockedFunction<typeof getOrderByNumberApi>;

const mockOrder = (number: number, name: string = 'test order'): TOrder => ({
  _id: `order-${number}`,
  number,
  name,
  status: 'done',
  createdAt: '2024-03-15T12:00:00.000Z',
  updatedAt: '2024-03-15T12:10:00.000Z',
  ingredients: [`ingredient-${number}-1`, `ingredient-${number}-2`]
});

describe('orderSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Начальное состояние', () => {
    test('возвращается при неизвестном действии', () => {
      const state = orderSlice(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual(initialState);
    });

    test('содержит корректные значения по умолчанию', () => {
      expect(initialState.orders).toEqual([]);
      expect(initialState.orderByNumberResponse).toBeNull();
      expect(initialState.request).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('Селекторы', () => {
    test('getOrderState возвращает текущее состояние слайса', () => {
      const state = { order: initialState };
      expect(getOrderState(state)).toEqual(initialState);
    });
  });

  describe('Обработка getOrderByNumber', () => {
    describe('Запрос выполнен успешно', () => {
      const order = mockOrder(40, 'Stellar Feast');

      beforeEach(() => {
        mockedGetOrderByNumberApi.mockResolvedValue({ success: true, orders: [order] });
      });

      test('устанавливается флаг ожидания, ошибки сбрасываются', () => {
        const state = orderSlice(initialState, { type: getOrderByNumber.pending.type });
        expect(state.request).toBe(true);
        expect(state.error).toBeNull();
        expect(state.orderByNumberResponse).toBeNull();
      });

      test('ответ сохраняется в состоянии', () => {
        const state = orderSlice(initialState, {
          type: getOrderByNumber.fulfilled.type,
          payload: order
        });
        expect(state.request).toBe(false);
        expect(state.error).toBeNull();
        expect(state.orderByNumberResponse).toEqual(order);
      });

      test('массив заказов не затрагивается', () => {
        const prevState = {
          ...initialState,
          orders: [mockOrder(41)]
        };
        const state = orderSlice(prevState, {
          type: getOrderByNumber.fulfilled.type,
          payload: order
        });
        expect(state.orders).toHaveLength(1);
        expect(state.orderByNumberResponse).toEqual(order);
      });
    });

    describe('Запрос завершён с ошибкой', () => {
      const errorMessage = 'Ошибка получения данных заказа';

      test('сообщение об ошибке сохраняется', () => {
        const state = orderSlice(initialState, {
          type: getOrderByNumber.rejected.type,
          error: { message: errorMessage }
        });
        expect(state.request).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orderByNumberResponse).toBeNull();
      });

      test('предыдущее значение сохраняется', () => {
        const previousOrder = mockOrder(99);
        const prevState = {
          ...initialState,
          orderByNumberResponse: previousOrder
        };
        const state = orderSlice(prevState, {
          type: getOrderByNumber.rejected.type,
          error: { message: errorMessage }
        });
        expect(state.orderByNumberResponse).toEqual(previousOrder);
      });

      test('обработка ошибки без сообщения', () => {
        const state = orderSlice(initialState, {
          type: getOrderByNumber.rejected.type,
          error: {}
        });
        expect(state.request).toBe(false);
        expect(state.error).toBeDefined();
      });
    });

    describe('Граничные случаи', () => {
      test('обработка null в ответе', () => {
        const state = orderSlice(initialState, {
          type: getOrderByNumber.fulfilled.type,
          payload: null as unknown as TOrder
        });
        expect(state.orderByNumberResponse).toBeNull();
        expect(state.request).toBe(false);
        expect(state.error).toBeNull();
      });

      test('обработка некорректных данных заказа', () => {
        const malformedOrder = {
          _id: '',
          number: 0,
          name: '',
          status: '',
          createdAt: '',
          updatedAt: '',
          ingredients: []
        } as TOrder;

        const state = orderSlice(initialState, {
          type: getOrderByNumber.fulfilled.type,
          payload: malformedOrder
        });

        expect(state.orderByNumberResponse).toEqual(malformedOrder);
      });
    });
  });
});
