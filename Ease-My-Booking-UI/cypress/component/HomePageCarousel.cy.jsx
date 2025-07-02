// cypress/component/Carousels.cy.jsx
import React from 'react';
import { mount } from 'cypress/react';
import Carousels from '../../src/components/HomePage/carousel/carousel';

describe('Carousels Component', () => {
  beforeEach(() => {
    mount(<Carousels />);
  });

  it('renders the carousel with indicators', () => {
    cy.get('.carousel-indicators').should('exist');
    cy.get('.carousel-item').should('have.length.at.least', 1);
  });

  it('displays the first slide content correctly', () => {
    cy.get('.carousel-item.active').within(() => {
      cy.contains('Mountain Adventure').should('exist');
      cy.contains('Experience thrilling mountain roads and breathtaking views.').should('exist');
    });
  });

  it('renders video containers in each slide', () => {
    cy.get('.carousel-item').each(($item) => {
      cy.wrap($item).find('video').should('exist');
    });
  });

  it('has gradient overlay and caption box in first slide', () => {
    cy.get('.carousel-item.active').within(() => {
      cy.get('.gradient-overlay').should('exist');
      cy.get('.caption-box').should('exist');
    });
  });
});