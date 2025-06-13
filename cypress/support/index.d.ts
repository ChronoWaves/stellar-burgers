/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredient(selector: string): Chainable<JQuery<HTMLElement>>;
    replaceBun(selectorOld: string, selectorNew: string): Chainable<JQuery<HTMLElement>>;
    openIngredientModal(selector: string): Chainable<JQuery<HTMLElement>>;
    closeModalByClick(): Chainable<JQuery<HTMLElement>>;
    closeModalByEscape(): Chainable<JQuery<HTMLElement>>;
  }
}
