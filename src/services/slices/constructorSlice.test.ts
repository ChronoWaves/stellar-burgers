import constructorSlice, {
  addIngredient,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  orderBurger,
  removeIngredient,
  resetModal,
  setRequest,
  TConstructorState
} from './constructorSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';
import { TOrder } from '@utils-types';

const mockIngredient = (id: string, name: string, type: string) => ({
  _id: id,
  name,
  type,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: `https://example.com/${id}.png`,
  image_mobile: `https://example.com/${id}-mobile.png`,
  image_large: `https://example.com/${id}-large.png`
});

describe('constructorSlice', () => {
  let baseState: TConstructorState;

  beforeEach(() => {
    baseState = { ...initialState };
  });

  describe('Добавление ингредиентов', () => {
    test('ингредиент добавляется в список', () => {
      const ingredient = mockIngredient('1', 'sauce', 'sauce');
      const state = constructorSlice(baseState, addIngredient(ingredient));

      expect(state.constructorItems.ingredients).toHaveLength(1);
      expect(state.constructorItems.ingredients[0]).toMatchObject(ingredient);
    });

    test('новая булка заменяет предыдущую', () => {
      const bun1 = mockIngredient('bun1', 'first bun', 'bun');
      const bun2 = mockIngredient('bun2', 'second bun', 'bun');

      let state = constructorSlice(baseState, addIngredient(bun1));
      state = constructorSlice(state, addIngredient(bun2));

      expect(state.constructorItems.bun).toMatchObject(bun2);
    });
  });

  describe('Удаление ингредиентов', () => {
    test('ингредиент удаляется по идентификатору', () => {
      const ingredient = mockIngredient('1', 'ingredient', 'main');
      let state = constructorSlice(baseState, addIngredient(ingredient));

      const idToRemove = state.constructorItems.ingredients[0].id;
      state = constructorSlice(state, removeIngredient(idToRemove));

      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Перемещение ингредиентов', () => {
    let populatedState: TConstructorState;

    beforeEach(() => {
      populatedState = {
        ...initialState,
        constructorItems: {
          bun: null,
          ingredients: [
            mockIngredient('1', 'Item 1', 'main'),
            mockIngredient('2', 'Item 2', 'main'),
            mockIngredient('3', 'Item 3', 'main')
          ].map((item, idx) => ({ ...item, id: idx.toString() }))
        }
      };
    });

    test('ингредиент перемещается вверх', () => {
      const state = constructorSlice(populatedState, moveIngredientUp(1));
      expect(state.constructorItems.ingredients.map(i => i.name)).toEqual(['Item 2', 'Item 1', 'Item 3']);
    });

    test('ингредиент перемещается вниз', () => {
      const state = constructorSlice(populatedState, moveIngredientDown(1));
      expect(state.constructorItems.ingredients.map(i => i.name)).toEqual(['Item 1', 'Item 3', 'Item 2']);
    });
  });

  describe('Обработка отправки заказа', () => {
    test('устанавливаются флаги ожидания и запроса', () => {
      const state = constructorSlice(baseState, { type: orderBurger.pending.type });
      expect(state.loading).toBe(true);
      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    test('состояние обновляется при успешной отправке', () => {
      const payload = { order: { number: 123, status: 'created', name: 'test burger' } };
      const state = constructorSlice(baseState, { type: orderBurger.fulfilled.type, payload });

      expect(state.loading).toBe(false);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(payload.order);
      expect(state.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('Обработка модального окна и признака запроса', () => {
    test('модальное окно очищается', () => {
      const stateWithModal = { ...baseState, orderModalData: {} as TOrder };
      const state = constructorSlice(stateWithModal, resetModal());

      expect(state.orderModalData).toBeNull();
    });

    test('признак запроса обновляется', () => {
      let state = constructorSlice(baseState, setRequest(true));
      expect(state.orderRequest).toBe(true);

      state = constructorSlice(state, setRequest(false));
      expect(state.orderRequest).toBe(false);
    });
  });
});
