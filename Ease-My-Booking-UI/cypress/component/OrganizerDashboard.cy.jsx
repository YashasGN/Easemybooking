import React from 'react';
import OrganiserDashboard from '../../src/components/organiser/organiserDashboard/organiserDashboard';
import { withMockStore } from '../support/mockStore';

describe('OrganiserDashboard Component', () => {
  beforeEach(() => {
    withMockStore(
      <OrganiserDashboard />, 
      {
        user: {
          isLoggedIn: true,
          userId: 1,
          email: 'organizer@example.com',
          role: ['Organiser'],
        },
        places: {
          status: 'succeeded',
          categories: [
            { id: 1, categoryName: 'Adventure' },
            { id: 2, categoryName: 'Nature' },
          ],
          places: [
            {
              id: 101,
              placeName: 'Wonder Park',
              city: 'Hyderabad',
              categoryId: 1,
              createdBy: 1,
              isActive: true,
              isVerified: true,
              isRejected: false,
            },
          ],
        },
      }
    );
  });

  it('renders sidebar title', () => {
    cy.contains('📋 Organizer Panel').should('exist');
  });

  it('displays user email in sidebar', () => {
    cy.contains('organizer@example.com').should('exist');
  });

  it('renders Place Management tab by default', () => {
    cy.contains('Place Management').should('exist');
  });

  it('renders Add Place button', () => {
    cy.contains('➕ Add Place').should('exist');
  });

  it('renders the added place card correctly', () => {
    cy.contains('Wonder Park').should('exist');
    cy.contains('Hyderabad').should('exist');
    cy.contains('Adventure').should('exist');
    cy.contains('Open').should('exist');
  });

  it('renders action buttons for a place', () => {
    cy.contains('View Details').should('exist');
    cy.contains('Close').should('exist');
    cy.contains('Edit').should('exist');
    cy.contains('Delete').should('exist');
  });
});
