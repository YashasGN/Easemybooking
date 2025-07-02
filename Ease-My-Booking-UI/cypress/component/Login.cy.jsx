// cypress/component/login/Login.cy.jsx
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/authentication/login/Login';
import userReducer from '../../src/appState/appSlicer/userSlcer';
import 'react-toastify/dist/ReactToastify.css';

const renderLogin = (preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState,
  });

  return cy.mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    </Provider>
  );
};

describe('<Login /> Easy Tests', () => {
  it('renders login form', () => {
    renderLogin();
    cy.get('input#username').should('exist');
    cy.get('input#password').should('exist');
    cy.get('button[type="submit"]').contains('Login');
  });

  it('allows typing in input fields', () => {
    renderLogin();
    cy.get('#username').type('testuser').should('have.value', 'testuser');
    cy.get('#password').type('secret').should('have.value', 'secret');
  });

  it('shows modal if user is admin', () => {
    renderLogin({
      user: {
        isLoggedIn: true,
        role: ['Admin'],
      },
    });
    cy.get('.popup-modal').should('exist');
    cy.contains('Select where to go');
  });

  it('shows toast on Google login click', () => {
    renderLogin();
    cy.contains('Login with Google').click();
    cy.contains('🔒 Google login not implemented.').should('exist');
  });
});
