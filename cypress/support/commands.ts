Cypress.Commands.add('addIngredient', (selector: string) => {
  cy.get(selector).find('button').click();
});

Cypress.Commands.add('openIngredientModal', (selector: string) => {
  cy.get(selector).find('a').click();
});

Cypress.Commands.add('replaceBun', (oldBun: string, newBun: string) => {
  cy.addIngredient(oldBun);
  cy.addIngredient(newBun);
});

Cypress.Commands.add('closeModalByClick', () => {
  cy.get('[data-cy="overlay"]').click({ force: true });
});

Cypress.Commands.add('closeModalByEscape', () => {
  cy.get('body').trigger('keydown', { key: 'Escape' });
});
