Cypress.Commands.add('login', () => {
  cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  cy.get('[name="username"]').type('Admin');
  cy.get('[name="password"]').type('admin123');
  cy.get('button[type="submit"]').click();
});
