/// <reference types="cypress" />

const API_URL = 'https://norma.nomoreparties.space/api';

const BUN_PRIMARY = '[data-cy="643d69a5c3f7b9001cfa093d"]';
const BUN_SECONDARY = '[data-cy="643d69a5c3f7b9001cfa093c"]';
const TOPPING_MAIN = '[data-cy="643d69a5c3f7b9001cfa0941"]';

beforeEach(() => {
  cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${API_URL}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' });

  cy.visit('/');
  cy.viewport(1280, 720);
  cy.get('#modals').as('modalContainer');
});

describe('Конструктор бургера', () => {
  it('увеличивает счетчик при добавлении ингредиента', () => {
    cy.addIngredient(TOPPING_MAIN);
    cy.get(TOPPING_MAIN).find('.counter__num').should('contain', '1');
  });

  describe('Сборка бургера', () => {
    it('добавление булки до начинки', () => {
      cy.addIngredient(BUN_PRIMARY);
      cy.addIngredient(TOPPING_MAIN);
    });

    it('добавление начинки до булки', () => {
      cy.addIngredient(TOPPING_MAIN);
      cy.addIngredient(BUN_PRIMARY);
    });
  });

  describe('Замена компонентов', () => {
    it('замена булки на другую', () => {
      cy.replaceBun(BUN_PRIMARY, BUN_SECONDARY);
    });

    it('замена булки после добавления начинки', () => {
      cy.addIngredient(BUN_PRIMARY);
      cy.addIngredient(TOPPING_MAIN);
      cy.addIngredient(BUN_SECONDARY);
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'mock_refresh_token');
    cy.setCookie('accessToken', 'mock_access_token');
  });

  afterEach(() => {
    cy.clearAllCookies();
    window.localStorage.clear();
  });

  it('создает заказ и отображает номер', () => {
    cy.addIngredient(BUN_PRIMARY);
    cy.addIngredient(TOPPING_MAIN);
    cy.get('[data-cy="order-button"]').click();
    cy.get('@modalContainer').find('h2').should('contain', '243');
  });
});

describe('Модальное окно ингредиента', () => {
  it('открывается по клику на ингредиент', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.openIngredientModal(TOPPING_MAIN);
    cy.get('@modalContainer').should('not.be.empty');
    cy.url().should('include', '643d69a5c3f7b9001cfa0941');
  });

  it('закрывается по кнопке закрытия', () => {
    cy.openIngredientModal(TOPPING_MAIN);
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('закрывается при клике по фону', () => {
    cy.openIngredientModal(TOPPING_MAIN);
    cy.closeModalByClick();
    cy.get('@modalContainer').should('be.empty');
  });

  it('закрывается по клавише', () => {
    cy.openIngredientModal(TOPPING_MAIN);
    cy.closeModalByEscape();
    cy.get('@modalContainer').should('be.empty');
  });
});
