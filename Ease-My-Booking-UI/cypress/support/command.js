Cypress.Commands.add('loginAsOrganizer', () => {
    cy.visit('/login');
    cy.get('input#username').type('organizer');
    cy.get('input#password').type('Organizer@123');
    cy.get('button[type="submit"]').click();
  });
  