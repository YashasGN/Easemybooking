import React from 'react';
import Header from '../../src/components/HomePage/header/Header';
import { withMockStore } from '../support/mockStore';

describe('Header Component', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    withMockStore(<Header />, {
      user: { isLoggedIn: false, email: '' },
      places: {
        searchResults: [],
        places: [],
      },
      search: {
        searchResults: [],
        searchQuery: '',
      },
    });
  });

  it('renders logo image', () => {
    cy.get('img[alt="Logo"]').should('exist');
  });

  it('renders "Select City" button', () => {
    cy.contains('button', 'Select City').should('exist');
  });

  it('renders "Sign In" button when user not logged in', () => {
    cy.contains('button', 'Sign In').should('exist');
  });

  it('opens city menu and selects a city', () => {
    cy.contains('Select City').click();
    cy.contains('Mumbai').click();
    cy.contains('Mumbai').should('exist');
  });

  it('navigates to home when logo is clicked', () => {
    cy.get('img[alt="Logo"]').click();
    cy.url().should('include', '/');
  });

  it('does not show profile avatar when user is not logged in', () => {
    cy.get('button').contains('Sign In').should('exist');
    cy.get('[data-testid="avatar"]').should('not.exist');
  });
});
