import React from 'react';

import Footer from '../../src/components/HomePage/footer/Footer'; // adjust the path

import { BrowserRouter } from 'react-router-dom';
 
describe('Footer Component', () => {

  beforeEach(() => {

    cy.mount(
<BrowserRouter>
<Footer />
</BrowserRouter>

    );

  });
 
  it('displays all sections', () => {

    cy.contains('Why EaseMyBooking').should('be.visible');

    cy.contains('Quick Links').should('be.visible');

    cy.contains('Legal').should('be.visible');

    cy.contains('Customer Policies').should('be.visible');

    cy.contains('Contact Us').should('be.visible');

  });
 
  it('shows quick links with correct text', () => {

    ['Home', 'FAQs', 'Support', 'Pricing'].forEach((text) => {

      cy.contains('a', text).should('exist');

    });

  });
 
  it('shows contact email and phone', () => {

    cy.contains('support@easemybooking.com').should('exist');

    cy.contains('+91-1234567890').should('exist');

  });
 
  it('shows the logo', () => {

    cy.get('img[alt="EaseMyBooking Logo"]').should('exist');

  });
 
  it('shows the copyright', () => {

    cy.contains('© 2025 EaseMyBooking').should('exist');

  });

});

 