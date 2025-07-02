import AdminDashboard from '../../src/components/admin/adminDashboard/adminDashboard';
import { withMockStore } from '../support/mockStore';

describe('AdminDashboard Component', () => {
    beforeEach(() => {
      
      withMockStore(<AdminDashboard />);
    });
  
    it('renders welcome message by default', () => {
      cy.contains('Admin Dashboard').should('exist');
      cy.contains('Select an option on the left to get started.').should('exist');
    });
  
    it('renders sidebar with title and buttons', () => {
      cy.contains('👋 Welcome, Admin').should('exist');
      cy.contains('Dashboard Navigation').should('exist');
      cy.contains('👁️ View Place').should('exist');
      cy.contains('✅ Verified Places').should('exist');
    });
  
  
    it('highlights View Place tab when clicked', () => {
      cy.contains('👁️ View Place').click();
      cy.contains('👁️ View Place').should('have.class', 'active');
    });
  
    
    it('activates Verified Places tab and renders VerifiedPlaces component', () => {
      cy.contains('✅ Verified Places').click();
      cy.contains('Verified Places').should('exist'); 
    });
  });
  