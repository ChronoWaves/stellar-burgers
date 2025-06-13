import userSlice, {
  getUser,
  getOrdersAll,
  initialState,
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
  TUserState
} from './userSlice';
import { TUser, TOrder } from '@utils-types';

const mockUser = (name: string, email: string): TUser => ({
  name,
  email
});

const mockOrder = (
  id: string,
  number: number,
  name: string,
  status: 'done' | 'pending'
): TOrder => ({
  _id: id,
  number,
  name,
  status,
  ingredients: [`ingredient-${id}-1`, `ingredient-${id}-2`],
  createdAt: `2024-03-15T12:00:0${id}.000Z`,
  updatedAt: `2024-03-15T12:10:0${id}.000Z`
});

const mockOrders: TOrder[] = [
  mockOrder('1', 1001, 'burger', 'done'),
  mockOrder('2', 1002, 'roll', 'pending')
];

describe('userSlice', () => {
  let baseState: TUserState;

  beforeEach(() => {
    baseState = {
      userData: null,
      userOrders: [],
      request: false,
      loginUserRequest: false,
      isAuthChecked: false,
      isAuthenticated: false,
      error: null
    };
  });

  describe('Начальное состояние', () => {
    test('возвращается при неизвестном действии', () => {
      const state = userSlice(undefined, { type: 'UNKNOWN' });
      expect(state).toEqual(initialState);
    });
  });

  describe('Загрузка профиля пользователя', () => {
    test('при запуске устанавливаются признаки авторизации', () => {
      const state = userSlice(baseState, { type: getUser.pending.type });
      expect(state.loginUserRequest).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('при успешном ответе сохраняются данные пользователя', () => {
      const user = mockUser('Name', 'test@example.com');
      const state = userSlice(baseState, {
        type: getUser.fulfilled.type,
        payload: { user }
      });
      expect(state.userData).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginUserRequest).toBe(false);
      expect(state.isAuthChecked).toBe(false);
    });

    test('при ошибке авторизация сбрасывается', () => {
      const state = userSlice(baseState, { type: getUser.rejected.type });
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
      expect(state.loginUserRequest).toBe(false);
    });
  });

  describe('Получение истории заказов', () => {
    test('при запуске запроса включается флаг загрузки', () => {
      const state = userSlice(baseState, { type: getOrdersAll.pending.type });
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    test('при получении данных список заказов обновляется', () => {
      const state = userSlice(baseState, {
        type: getOrdersAll.fulfilled.type,
        payload: mockOrders
      });
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.request).toBe(false);
    });

    test('при ошибке сохраняется сообщение', () => {
      const state = userSlice(baseState, {
        type: getOrdersAll.rejected.type,
        payload: 'Ошибка'
      });
      expect(state.request).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  describe('Регистрация', () => {
    test('при запуске запроса включаются признаки авторизации', () => {
      const state = userSlice(baseState, { type: registerUser.pending.type });
      expect(state.request).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('при получении данных сохраняется пользователь и статус', () => {
      const user = mockUser('Name', 'test@example.com');
      const state = userSlice(baseState, {
        type: registerUser.fulfilled.type,
        payload: { user }
      });
      expect(state.userData).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.request).toBe(false);
    });

    test('при ошибке сохраняется текст ошибки и сбрасывается флаг', () => {
      const state = userSlice(baseState, {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации'
      });
      expect(state.request).toBe(false);
      expect(state.error).toBe('Ошибка регистрации');
      expect(state.isAuthChecked).toBe(false);
    });
  });

  describe('Вход в систему', () => {
    test('при запуске устанавливаются признаки входа', () => {
      const state = userSlice(baseState, { type: loginUser.pending.type });
      expect(state.loginUserRequest).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('при получении данных сохраняется пользователь и статус', () => {
      const user = mockUser('Name', 'test@example.com');
      const state = userSlice(baseState, {
        type: loginUser.fulfilled.type,
        payload: { user }
      });
      expect(state.userData).toEqual(user);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loginUserRequest).toBe(false);
    });

    test('при ошибке сохраняется сообщение и сбрасывается статус', () => {
      const state = userSlice(baseState, {
        type: loginUser.rejected.type,
        payload: 'Ошибка входа'
      });
      expect(state.loginUserRequest).toBe(false);
      expect(state.error).toBe('Ошибка входа');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Обновление данных пользователя', () => {
    test('при запуске включается индикатор загрузки', () => {
      const state = userSlice(baseState, { type: updateUser.pending.type });
      expect(state.request).toBe(true);
      expect(state.error).toBeNull();
    });

    test('при обновлении данные заменяются', () => {
      const user = mockUser('Name', 'test@example.com');
      const state = userSlice(baseState, {
        type: updateUser.fulfilled.type,
        payload: { user }
      });
      expect(state.userData).toEqual(user);
      expect(state.request).toBe(false);
    });

    test('при ошибке данные сохраняются, ошибка фиксируется', () => {
      const user = mockUser('Name', 'test@example.com');
      const stateWithUser = { ...baseState, userData: user };
      const state = userSlice(stateWithUser, {
        type: updateUser.rejected.type,
        payload: 'Ошибка обновления'
      });
      expect(state.userData).toEqual(user);
      expect(state.error).toBe('Ошибка обновления');
    });
  });

  describe('Выход из аккаунта', () => {
    const user = mockUser('Name', 'test@example.com');
    const authState: TUserState = {
      ...baseState,
      userData: user,
      isAuthenticated: true
    };

    test('при запуске запроса авторизация сохраняется', () => {
      const state = userSlice(authState, { type: logoutUser.pending.type });
      expect(state.request).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
    });

    test('при успешной обработке данные сбрасываются', () => {
      const state = userSlice(authState, { type: logoutUser.fulfilled.type });
      expect(state.userData).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.request).toBe(false);
    });

    test('при ошибке авторизация сохраняется, сообщение сохраняется', () => {
      const state = userSlice(authState, {
        type: logoutUser.rejected.type,
        payload: 'Ошибка выхода'
      });
      expect(state.error).toBe('Ошибка выхода');
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
