import ingredientSlice, {
  getIngredients,
  initialState
} from './ingredientSlice';
import { expect, test, describe, beforeEach } from '@jest/globals';
import { TIngredient } from '@utils-types';

type TIngredientState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const mockIngredient = (id: string, name: string, type: string): TIngredient => ({
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

describe('ingredientSlice', () => {
  let baseState: TIngredientState;
  let ingredients: TIngredient[];

  beforeEach(() => {
    baseState = {
      ingredients: [],
      loading: false,
      error: null
    };

    ingredients = [
      mockIngredient('1', 'bun', 'bun'),
      mockIngredient('2', 'main', 'main'),
      mockIngredient('3', 'sauce', 'sauce')
    ];
  });

  describe('Начальное состояние', () => {
    test('возвращается при инициализации', () => {
      const state = ingredientSlice(undefined, { type: 'INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Обработка запроса ингредиентов', () => {
    test('при запуске запроса устанавливается флаг загрузки и сбрасывается ошибка', () => {
      const state = ingredientSlice(baseState, { type: getIngredients.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('существующий список ингредиентов сохраняется при новом запросе', () => {
      const prevState = { ...baseState, ingredients };
      const state = ingredientSlice(prevState, { type: getIngredients.pending.type });
      expect(state.ingredients).toEqual(ingredients);
      expect(state.loading).toBe(true);
    });
  });

  describe('Успешное завершение запроса', () => {
    test('список ингредиентов обновляется при пустом ответе', () => {
      const state = ingredientSlice(baseState, {
        type: getIngredients.fulfilled.type,
        payload: []
      });
      expect(state.ingredients).toEqual([]);
      expect(state.loading).toBe(false);
    });

    test('список ингредиентов обновляется при наличии данных', () => {
      const state = ingredientSlice(baseState, {
        type: getIngredients.fulfilled.type,
        payload: ingredients
      });
      expect(state.ingredients).toEqual(ingredients);
      expect(state.loading).toBe(false);
    });

    test('новые данные заменяют старые', () => {
      const prevState = { ...baseState, ingredients: [ingredients[0]] };
      const state = ingredientSlice(prevState, {
        type: getIngredients.fulfilled.type,
        payload: [ingredients[1], ingredients[2]]
      });
      expect(state.ingredients).toEqual([ingredients[1], ingredients[2]]);
    });

    test('порядок ингредиентов сохраняется', () => {
      const shuffled = [ingredients[2], ingredients[0], ingredients[1]];
      const state = ingredientSlice(baseState, {
        type: getIngredients.fulfilled.type,
        payload: shuffled
      });
      expect(state.ingredients).toEqual(shuffled);
    });
  });

  describe('Ошибка при выполнении запроса', () => {
    test('в случае ошибки сохраняется сообщение, список очищается', () => {
      const error = 'Ошибка загрузки данных';
      const state = ingredientSlice(baseState, {
        type: getIngredients.rejected.type,
        error: { message: error }
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
      expect(state.ingredients).toEqual([]);
    });

    test('существующие данные сохраняются при ошибке', () => {
      const prevState = { ...baseState, ingredients };
      const error = 'Ошибка сети';
      const state = ingredientSlice(prevState, {
        type: getIngredients.rejected.type,
        error: { message: error }
      });
      expect(state.ingredients).toEqual(ingredients);
      expect(state.error).toBe(error);
    });
  });
});
