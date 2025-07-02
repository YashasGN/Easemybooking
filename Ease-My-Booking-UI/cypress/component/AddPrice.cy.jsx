import React from 'react';
import AddPrice from '../../src/components/organiser/addPrice/addPrice';
import { withMockStore } from '../support/mockStore';

describe('<AddPrice /> Easy Tests with Mock Store', () => {
  const mockState = {
    packages: {
      items: [
        { id: 1, packageName: 'Wonder Park' },
      ],
    },
    slotPrice: {
      slotsByPackageId: {
        1: [
          {
            slotsId: 101,
            date: '2025-07-10T00:00:00',
            timeFrom: '09:00 AM',
            timeTo: '11:00 AM',
          },
        ],
      },
      pricesByPackageId: {},
    },
  };

  beforeEach(() => {
    withMockStore(<AddPrice open={true} handleClose={() => {}} />, mockState);
  });

  it('renders the dialog with title', () => {
    cy.contains('Add Price').should('exist');
  });

  it('renders all price input fields', () => {
    cy.get('input[name="priceChildren"]').should('exist');
    cy.get('input[name="priceAdults"]').should('exist');
    cy.get('input[name="priceSenior"]').should('exist');
    cy.get('input[name="priceForeign"]').should('exist');
  });



  it('renders the Cancel and Add Price buttons', () => {
    cy.contains('Cancel').should('exist');
    cy.contains('Add Price').should('exist');
  });
});
