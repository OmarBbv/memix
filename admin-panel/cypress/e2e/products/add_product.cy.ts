describe('Add Product Page (Real API)', () => {
  beforeEach(() => {
    // Handle uncaught exceptions
    cy.on('uncaught:exception', (err, runnable) => {
      console.log('Uncaught Exception:', err.message);
      return false; // Prevent Cypress from failing the test
    });

    // Login to get a real token
    cy.request({
      method: 'POST',
      url: 'http://localhost:4444/auth/login',
      body: {
        email: 'admin@memix.com',
        password: 'admin1234',
      },
      failOnStatusCode: false
    }).then((response) => {
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(response.body)}`);
      }
      const token = response.body.access_token;

      // Visit the page with the real token
      cy.visit('/products/create', {
        onBeforeLoad: (win) => {
          win.localStorage.setItem('token', token);
        },
      });
    });
  });

  context('Positive Scenarios', () => {
    it('should successfully create a product with ALL fields valid (Slow Mode)', () => {
      // Intercept the real network request
      cy.intercept('POST', '**/products').as('createProductSuccess');

      const waitTime = 1000; // 1 second delay between actions

      // 1. Product Name
      const uniqueName = `Cypress Product ${Date.now()}`;
      cy.get('input[name="name"]').should('be.visible').type(uniqueName, { delay: 100 });
      cy.wait(waitTime);

      // 2. Description
      cy.get('textarea[name="description"]').type('Bu məhsul Cypress testi tərəfindən yaradılmışdır.', { delay: 50 });
      cy.wait(waitTime);

      // 3. Price
      cy.get('input[name="price"]').clear().type('250.00', { delay: 100 });
      cy.wait(waitTime);

      // 4. Stock
      cy.get('input[name="stock"]').clear().type('100', { delay: 100 });
      cy.wait(waitTime);

      // 5. Add Branch Stock
      cy.contains('button', 'Filial Əlavə Et').click();
      cy.wait(waitTime);

      // Select the FIRST branch from the newly added row
      cy.contains('option', 'Filial seçin', { timeout: 10000 })
        .parent('select')
        .should('be.visible')
        .then($select => {
          const $options = $select.find('option:not([disabled])');
          if ($options.length > 0) {
            cy.wrap($select).select($options.first().val() as string);
          }
        });
      cy.wait(waitTime);

      // Fill Branch Stock quantity
      cy.get('input[name="branchStocks.0.stock"]').clear().type('20', { delay: 100 });
      cy.wait(waitTime);

      // 6. Select Category
      cy.contains('label', 'Kateqoriya').parent().find('select').should('be.visible').then($select => {
        const $options = $select.find('option').filter(function () {
          return !this.disabled && this.value !== '';
        });
        if ($options.length > 0) {
          cy.wrap($select).select($options.first().val() as string);
        }
      });
      cy.wait(waitTime);

      // 7. Tags
      cy.get('input#tags').should('be.visible').type('Cypress, Test, Avtomatik', { delay: 100 });
      cy.wait(waitTime);

      // 8. Add Variant
      cy.contains('label', 'Variant Adı').parent().find('input').type('Size', { delay: 100 });
      cy.wait(waitTime);
      cy.contains('label', 'Dəyərlər').parent().find('input').type('M, L, XL', { delay: 100 });
      cy.wait(waitTime);
      cy.contains('button', 'Variant Əlavə Et').click();
      cy.contains('Size:').should('exist');
      cy.wait(waitTime);

      // 9. Check Is Featured
      cy.contains('Bu məhsulu vitrində (Öne Çıxan) göstər').click();
      cy.wait(waitTime);

      // 10. Submit Form
      cy.contains('button', 'Məhsul Yarat').should('not.be.disabled').click();

      // 11. Verify API Call & Redirection
      cy.wait('@createProductSuccess', { timeout: 15000 }).then((interception) => {
        expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
        expect(interception.response?.body).to.have.property('id');
      });
      cy.url().should('include', '/products');
    });
  });
});
