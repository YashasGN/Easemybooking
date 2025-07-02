import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../src/authentication/register/register';
import userReducer from '../../src/appState/appSlicer/userSlcer';

const renderRegister = () => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
  });

  return cy.mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/register']}>
        <Register />
      </MemoryRouter>
    </Provider>
  );
};

describe('<Register /> Easy Tests', () => {
    it('renders all input fields', () => {
      renderRegister();
      cy.get('#userName').should('exist');
      cy.get('#email').should('exist');
      cy.get('#dob').should('exist');
      cy.get('#password').should('exist');
      cy.get('#city').should('exist');
      cy.get('button[type="submit"]').should('contain', 'Register');
    });
  
    it('allows typing in all fields', () => {
      renderRegister();
      cy.get('#userName').type('testuser').should('have.value', 'testuser');
      cy.get('#email').type('test@example.com').should('have.value', 'test@example.com');
      cy.get('#dob').type('2000-01-01').should('have.value', '2000-01-01');
      cy.get('#password').type('mypassword').should('have.value', 'mypassword');
      cy.get('#city').type('Hyderabad').should('have.value', 'Hyderabad');
    });
  
    it('renders the heading "Create Account"', () => {
      renderRegister();
      cy.contains('Create Account').should('exist');
    });
  
    it('register button is enabled (default behavior)', () => {
      renderRegister();
      cy.get('button[type="submit"]').should('exist').should('not.be.disabled');
    });
  
    it('region input has default value IN', () => {
      renderRegister();
      cy.get('input[name="region"]').should('have.value', 'IN');
    });
  
    it('submits the form when filled', () => {
        renderRegister();
      
        cy.get('#userName').should('not.be.disabled').type('john');
        cy.get('#email').should('not.be.disabled').type('john@example.com');
        cy.get('#dob').should('not.be.disabled').type('1995-05-05');
        cy.get('#password').should('not.be.disabled').type('securepass');
        cy.get('#city').should('not.be.disabled').type('Delhi');
      
        cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));
        cy.get('form').submit();
        cy.get('@alertStub').should('not.be.called'); // Only checking submit happens cleanly
      });      
    });
  