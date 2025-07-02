describe('Organizer Dashboard - Complete Workflow', () => {
  const testPlace = {
    name: 'Nehru Zoo Park',
    category: '1',
    city: 'Bangalore',
    state: 'Telangana',
    country: 'India',
    address: 'Address ABC',
    pinCode: '500001',
    description: 'Nice place',
    imageUrl: 'https://example.com/place-image.jpg'
  };

  const testPackage = {
    name: 'Safari Trip Package',
    details: 'Explore the wildlife World',
    imageUrl: 'https://example.com/package-image.jpg'
  };

  const testSlot = {
    date: new Date().toISOString().split('T')[0], // Today's date
    timeFrom: '09:00',
    timeTo: '11:00',
    maxTicket: '100'
  };

  const testPrice = {
    children: '50',
    adults: '100',
    senior: '80',
    foreign: '200'
  };

  before(() => {
    cy.visit('http://localhost:5173');
    // Login
    cy.contains('button', 'Sign In').click();
    cy.get('input#username').type('organizer');
    cy.get('input#password').type('Organizer@123');
    cy.get('button.login-button').click();
  });

  it('should complete the full organizer workflow', () => {
    // 1. Select Organizer Dashboard
    cy.contains('🧭 Organiser Dashboard').should('be.visible').click();
    cy.url().should('include', '/organiser/dashboard');

    // 2. Add Place (your working implementation)
    cy.intercept('POST', '**/gateway/Place/add').as('addPlace');
    cy.contains('button', '➕ Add Place').click();
    
    cy.get('.modal-content').within(() => {
      cy.get('input[name="placeName"]').type(testPlace.name);
      cy.get('select[name="categoryId"]').select(testPlace.category);
      cy.get('input[name="city"]').type(testPlace.city);
      cy.get('input[name="state"]').type(testPlace.state);
      cy.get('input[name="country"]').type(testPlace.country);
      cy.get('textarea[name="address"]').type(testPlace.address);
      cy.get('input[name="pinCode"]').type(testPlace.pinCode);
      cy.get('textarea[name="description"]').type(testPlace.description);
      cy.get('input[name="imageUrl"]').type(testPlace.imageUrl);
      cy.contains('button', 'Add').click();
    });

    cy.wait('@addPlace').its('response.statusCode').should('eq', 200);
    cy.contains(testPlace.name, { timeout: 10000 }).should('be.visible');

    // 3. View Details and Add Package
    cy.contains('.place-name', testPlace.name)
      .parents('.place-row')
      .within(() => {
        cy.contains('button', 'View Details').click();
      });

    cy.get('.place-details-container', { timeout: 10000 }).should('be.visible');
    
    // Add Package
    cy.intercept('POST', '**/gateway/Package/add').as('addPackage');
    cy.contains('button', '➕ Add Package').click();
    cy.get('.MuiDialog-container').within(() => {
      cy.get('input[name="packageName"]').type(testPackage.name);
      cy.get('textarea[name="details"]').type(testPackage.details);
      cy.get('input[name="imageUrl"]').type(testPackage.imageUrl);
      cy.contains('button', 'Add').click();
    });

    cy.wait('@addPackage').its('response.statusCode').should('eq', 200);
    cy.contains(testPackage.name, { timeout: 5000 }).should('be.visible');

    // 4. Add Slot
    cy.intercept('POST', '**/gateway/Slot/add').as('addSlot');
    cy.contains('button', '➕ Add Slot').click();
    
    cy.get('.MuiDialog-container').within(() => {
      cy.get('[data-testid="select-package"]').parent().click();
      cy.get('[role="listbox"]').contains(testPackage.name).click();

      cy.get('input[name="date"]').clear().type(testSlot.date);
      cy.contains('label', 'Select From').click();
      cy.get('[role="listbox"]').contains(testSlot.timeFrom).click();
      cy.contains('label', 'Select To').click();
      cy.get('[role="listbox"]').contains(testSlot.timeTo).click();
      cy.get('input[name="maxTicket"]').type(testSlot.maxTicket);
      cy.contains('button', 'Add Slot').click();
    });

    cy.wait('@addSlot').its('response.statusCode').should('eq', 200);
    cy.contains(`${testSlot.timeFrom}-${testSlot.timeTo}`).should('be.visible');

    // 5. Add Price
    cy.intercept('POST', '**/gateway/Price/add').as('addPrice');
    cy.contains('button', '➕ Add Price').click();
    
    cy.get('.MuiDialog-container').within(() => {
      cy.contains('label', 'Select Package').click();
      cy.get('[role="listbox"]').contains(testPackage.name).click();
      cy.contains('label', 'Select Slot').click();
      cy.get('[role="listbox"] li').first().click();
      cy.get('input[name="priceChildren"]').type(testPrice.children);
      cy.get('input[name="priceAdults"]').type(testPrice.adults);
      cy.get('input[name="priceSenior"]').type(testPrice.senior);
      cy.get('input[name="priceForeign"]').type(testPrice.foreign);
      cy.contains('button', 'Add Price').click();
    });

    cy.wait('@addPrice').its('response.statusCode').should('eq', 200);
    
    // Final verification
    cy.contains('h4', testPackage.name).should('be.visible');
    cy.contains(`${testSlot.timeFrom}-${testSlot.timeTo}`).should('be.visible');
    cy.contains(`Children: ₹${testPrice.children}`).should('be.visible');
    cy.contains(`Adults: ₹${testPrice.adults}`).should('be.visible');
  });

  after(() => {
    // Add cleanup code if needed
  });
});