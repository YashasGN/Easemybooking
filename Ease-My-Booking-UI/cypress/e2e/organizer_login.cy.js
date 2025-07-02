describe('Organizer Login Flow', () => {
    it('logs in as organizer and navigates to dashboard', () => {
      // Step 1: Visit the home page
      cy.visit('http://localhost:5173');
  
      // Step 2: Click the Sign In button
      cy.contains('Sign In').click();
  
      // Step 3: Fill login credentials
      cy.get('input#username').should('be.visible').type('organizer');
      cy.get('input#password').should('be.visible').type('Organizer@123');
  
      // Step 4: Submit the form
      cy.get('button.login-button').click();
  
      // Step 5: Wait for and click Organizer Dashboard in modal
      cy.contains('Select where to go').should('be.visible');
      cy.contains('🧭 Organiser Dashboard').should('be.visible').click();
  
      // Step 6: Confirm redirection
      cy.url().should('include', '/organiser/dashboard');
  
      // Optional: Confirm that dashboard content is visible
      cy.contains('➕ Add Place').should('be.visible');
    });
  });
  