describe('Add Product Page (Ghost Test - Mocked API)', () => {
  beforeEach(() => {
    // Set a dummy token
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'dummy-token');
    });

    // Mock Categories
    cy.intercept('GET', '**/categories*', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Geyim', sizeType: 'beden-text' },
        { id: 2, name: 'Ayaqqabı', sizeType: 'ayaqqabi' },
        { id: 3, name: 'Aksesuar', sizeType: 'tek-olcu' },
      ],
    }).as('getCategories');

    // Mock Branches
    cy.intercept('GET', '**/branches*', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Gənclik Mall' },
        { id: 2, name: '28 Mall' },
      ],
    }).as('getBranches');

    // Mock Product Creation
    cy.intercept('POST', '**/products*', {
      statusCode: 201,
      body: { id: 123, name: 'Test Product' },
    }).as('createProduct');

    // Visit page
    cy.visit('/products/create');

    // Wait for initial load
    cy.contains('Yeni Məhsul', { timeout: 15000 }).should('be.visible');

    // Wait for API calls to ensure dropdowns are populated
    cy.wait(['@getCategories', '@getBranches']);
  });

  context('Negative Scenarios (Validations)', () => {
    it('should show validation errors when submitting an empty form', () => {
      cy.get('form button[type="submit"]').first().click({ force: true });

      // Use broad regex for validation messages to avoid mapping issues
      cy.contains(/name must be/i, { timeout: 10000 }).should('be.visible');
      cy.contains(/price must be/i, { timeout: 10000 }).should('be.visible');
    });

    it('should enforce numeric input for price', () => {
      cy.get('input[name="price"]').type('abc', { force: true });
      cy.get('input[name="price"]').invoke('val').should('be.empty');

      cy.get('input[name="price"]').clear().type('125.50');
      cy.get('input[name="price"]').should('have.value', '125.50');
    });
  });

  context('Positive Scenarios & New Features', () => {
    it('should automatically generate stock rows when a category is selected', () => {
      // Find and click the category dropdown
      cy.contains('Kateqoriya seçin').click({ force: true });

      // Target the dropdown list item specifically
      cy.contains('.cursor-pointer', 'Geyim').should('be.visible').click({ force: true });

      // Verify row generation
      cy.get('.flex.items-end', { timeout: 20000 }).should('have.length.at.least', 1);
      cy.contains('XXS', { timeout: 10000 }).should('exist');
    });

    it('should allow manual entry (custom value) for Color and Size', () => {
      // Must select category first to render the stock rows for branches
      cy.contains('Kateqoriya seçin').click({ force: true });
      cy.contains('.cursor-pointer', 'Geyim').should('be.visible').click({ force: true });
      cy.get('.flex.items-end', { timeout: 20000 }).should('have.length.at.least', 1);

      cy.contains('button', '+ Stok Sətri').click({ force: true });
      cy.get('.flex.items-end').should('have.length', 10);

      // Test Custom Color
      cy.get('.flex.items-end').last().within(() => {
        cy.wait(500);
        cy.contains('span', 'Rəng seçin').click({ force: true });
        cy.get('input[placeholder="Axtar..."]').should('exist').type('Xüsusi Rəng', { yabnlis force: true });
        cy.contains('Əllə daxil et:').should('be.visible').click({ force: true });
        cy.contains('Xüsusi Rəng').should('exist');
      });

      // Test Custom Size
      cy.get('.flex.items-end').last().within(() => {
        cy.wait(500);
        cy.contains('span', 'Ölçü').click({ force: true });
        cy.get('input[placeholder="Axtar..."]').should('exist').type('7XL', { force: true });
        cy.contains('Əllə daxil et:').should('be.visible').click({ force: true });
        cy.contains('7XL').should('exist');
      });
    });

    it('should successfully submit the form with all fields', () => {
      cy.get('input[name="name"]').type('Yeni Məhsul', { force: true });
      cy.get('input[name="price"]').clear().type('99.99', { force: true });

      // Select Category
      cy.contains('Kateqoriya seçin').click({ force: true });
      cy.contains('.cursor-pointer', 'Aksesuar').should('be.visible').click({ force: true });

      // Fill the created row
      cy.get('.flex.items-end', { timeout: 15000 }).first().within(() => {
        cy.contains('Rəng seçin').click({ force: true });
        cy.get('input[placeholder="Axtar..."]').first().type('Qara', { force: true });
        cy.contains('.cursor-pointer', 'Qara').click({ force: true });

        cy.get('input[placeholder="0"]').type('50', { force: true });
      });

      // Submit
      cy.get('form button[type="submit"]').first().click({ force: true });

      // Verify intercept
      cy.wait('@createProduct', { timeout: 20000 }).then((interception) => {
        // FormData validation
        expect(interception.request.body).to.include('Yeni Məhsul');
      });
      cy.url({ timeout: 10000 }).should('include', '/products');
    });
  });
});
