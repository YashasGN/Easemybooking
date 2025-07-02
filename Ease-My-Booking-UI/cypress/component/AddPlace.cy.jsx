/// <reference types="cypress" />
import React from 'react';
import AddPlace from '../../src/components/organiser/addPlace/addPlace';
import { mount } from 'cypress/react';

describe('AddPlace Component', () => {
  const mockCategories = [
    { id: 'cat1', categoryName: 'Zoo' },
    { id: 'cat2', categoryName: 'Museum' }
  ];

  const organizerId = 'org123';

  it('renders Add New Place form correctly', () => {
    mount(
      <AddPlace
        categories={mockCategories}
        organizerId={organizerId}
        onAddPlace={() => {}}
        onCancel={() => {}}
      />
    );

    cy.contains('Add New Place');
    cy.get('input[name="placeName"]').should('exist');
    cy.get('select[name="categoryId"]').should('exist');
    cy.get('input[name="city"]').should('exist');
    cy.get('button.submit-btn').should('contain', 'Add Place');
    cy.get('button.cancel-btn').should('exist');
  });

  it('shows correct data in edit mode', () => {
    const initialData = {
      placeName: 'Nehru Zoo',
      categoryId: 'cat1',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      address: 'Bahadurpura',
      pinCode: '500064',
      description: 'Popular zoo in Hyderabad',
      imageUrl: 'http://image.url/zoo.jpg'
    };

    mount(
      <AddPlace
        categories={mockCategories}
        organizerId={organizerId}
        editing={true}
        initialData={initialData}
        onAddPlace={() => {}}
        onCancel={() => {}}
      />
    );

    cy.contains('Edit Place');
    cy.get('input[name="placeName"]').should('have.value', 'Nehru Zoo');
    cy.get('select[name="categoryId"]').should('have.value', 'cat1');
    cy.get('input[name="city"]').should('have.value', 'Hyderabad');
    cy.get('textarea[name="description"]').should('have.value', 'Popular zoo in Hyderabad');
    cy.get('button.submit-btn').should('contain', 'Update Place');
  });

  it('calls onCancel when Cancel is clicked', () => {
    const cancelSpy = cy.stub().as('cancelSpy');

    mount(
      <AddPlace
        categories={mockCategories}
        organizerId={organizerId}
        onAddPlace={() => {}}
        onCancel={cancelSpy}
      />
    );

    cy.get('button.cancel-btn').click();
    cy.get('@cancelSpy').should('have.been.calledOnce');
  });

  it('calls onAddPlace with valid form data', () => {
    const addPlaceSpy = cy.stub().as('addPlaceSpy');

    mount(
      <AddPlace
        categories={mockCategories}
        organizerId={organizerId}
        onAddPlace={addPlaceSpy}
        onCancel={() => {}}
      />
    );

    cy.get('input[name="placeName"]').type('City Park');
    cy.get('select[name="categoryId"]').select('Zoo');
    cy.get('input[name="city"]').type('Bangalore');
    cy.get('input[name="pinCode"]').type('560001');

    cy.get('button.submit-btn').click();
    cy.get('@addPlaceSpy').should('have.been.calledOnce');

    cy.get('@addPlaceSpy').its('firstCall.args.0').should('deep.include', {
      placeName: 'City Park',
      categoryId: 'cat1',
      city: 'Bangalore',
      pinCode: 560001,
      createdBy: organizerId
    });
  });
});
