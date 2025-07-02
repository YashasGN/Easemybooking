describe('Organiser Dashboard - Add Place Flow', () => {
    beforeEach(() => {
      // Visit full login URL
      cy.visit('http://localhost:5173');
  
      // Click "Sign In"
      cy.contains('Sign In').click();
  
      // Fill login form
      cy.get('input#username').should('be.visible').type('organizer');
      cy.get('input#password').should('be.visible').type('Organizer@123');
      cy.get('button.login-button').click();
  
      // Wait for modal and go to dashboard
      cy.contains('🧭 Organiser Dashboard').should('be.visible').click();
  
      // Confirm we're on dashboard
      cy.url().should('include', '/organiser/dashboard');
    });
  
    it('opens Add Place modal and displays form', () => {
      // Click on Add Place
      cy.contains('➕ Add Place').click();
  
      // Check modal opens
      cy.get('.modal-content').should('be.visible');
  
      // Basic form fields presence check
      cy.get('input[name="placeName"]').should('exist');
      cy.get('select[name="categoryId"]').should('exist');
      cy.get('input[name="city"]').should('exist');
  
      // Close modal
      cy.contains('Cancel').click();
  
      // Ensure modal closes
      cy.get('.modal-content').should('not.exist');
    });
  });
  