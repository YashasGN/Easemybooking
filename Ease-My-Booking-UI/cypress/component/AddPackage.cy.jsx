/// <reference types="cypress" />
import React from 'react';
import AddPackage from '../../src/components/organiser/addPackage/addPackage';
import { withMockStore } from '../support/mockStore'; 

describe('AddPackage Component', () => {
  it('renders Add Package form with city pre-filled', () => {
    withMockStore(
      <AddPackage open={true} handleClose={() => {}} placeId={1} />,
      {
        places: {
          places: [{ id: 1, city: 'Delhi' }],
        },
      }
    );

    cy.contains('Add Package'); // Title
    cy.get('input[name="packageName"]').should('exist');
    cy.get('input[name="city"]').should('have.value', 'Delhi');
    cy.get('button').contains('Add').should('exist');
  });

  it('renders Edit Package form with initial data', () => {
    const initialData = {
      id: 10,
      packageName: 'Nature Trail',
      details: 'Explore the wilderness.',
      imageUrl: 'http://img.test/nature.jpg',
      city: 'Delhi',
    };

    withMockStore(
      <AddPackage
        open={true}
        handleClose={() => {}}
        mode="edit"
        initialData={initialData}
      />,
      {
        places: {
          places: [{ id: 1, city: 'Delhi' }],
        },
      }
    );

    cy.contains('Edit Package'); // Title
    cy.get('input[name="packageName"]').should('have.value', 'Nature Trail');
    cy.get('textarea[name="details"]').should('have.value', 'Explore the wilderness.');
    cy.get('input[name="imageUrl"]').should('have.value', 'http://img.test/nature.jpg');
    cy.get('input[name="city"]').should('not.exist'); // city not visible in edit mode
    cy.get('button').contains('Update').should('exist');
  });

  it('renders all required input fields in add mode', () => {
    withMockStore(
      <AddPackage open={true} handleClose={() => {}} placeId={1} />,
      {
        places: {
          places: [{ id: 1, city: 'Delhi' }],
        },
      }
    );

    cy.get('input[name="packageName"]').should('exist');
    cy.get('textarea[name="details"]').should('exist');
    cy.get('input[name="imageUrl"]').should('exist');
    cy.get('input[name="city"]').should('exist');
  });

  it('Cancel button closes the dialog', () => {
    const onClose = cy.stub().as('onClose');

    withMockStore(
      <AddPackage open={true} handleClose={onClose} placeId={1} />,
      {
        places: {
          places: [{ id: 1, city: 'Delhi' }],
        },
      }
    );

    cy.contains('Cancel').click();
    cy.get('@onClose').should('have.been.calledOnce');
    it('handles package with missing rating gracefully', () => {
      const packageWithoutRating = {
        ...packageData,
        rating: null
      };
    
      withMockStore(
        <PlaceModal place={mockPlace} onClose={() => {}} onConfirm={() => {}} />,
        { packages: { items: [packageWithoutRating] }, slotPrice: {} }
      );
    
      cy.contains('Rating:').should('not.exist');
    });
    
  });
});