// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginAsOrganizer', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Sign In').click();
    cy.get('input#username').should('be.visible').type('organizer');
    cy.get('input#password').should('be.visible').type('Organizer@123');
    cy.get('button.login-button').click();
    cy.contains('🧭 Organiser Dashboard').should('be.visible').click();
    cy.url().should('include', '/organiser/dashboard');
  });

