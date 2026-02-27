/// <reference types="cypress" />

describe('Marketing Management', () => {
  beforeEach(() => {
    // Intercept API calls to mock responses for tests
    cy.intercept('GET', '/api/v1/brands?all=true', { body: [] }).as('getBrands');
    cy.intercept('GET', '/api/v1/banners?all=true', { body: [] }).as('getBanners');
    cy.intercept('GET', '/api/v1/coupons?all=true', { body: [] }).as('getCoupons');

    // Mocks for Auth and basic requests if necessary
    // cy.login('admin@memix.az', 'password'); // pseudo command

    // As basic testing, let's just visit the routes
    // Ensure you have auth bypassed or logged in depending on setup
  });

  it('visits Banners page and clicks Add Banner', () => {
    cy.visit('/marketing/banners');
    cy.wait('@getBanners');
    cy.contains('h2', 'Bannerlər').should('be.visible');
    cy.contains('button', 'Yeni Banner').click();
    cy.contains('h3', 'Banner Əlavə Et').should('be.visible');
    cy.get('input#title').type('Test Banner');
    cy.contains('button', 'Yadda saxla').should('be.enabled');
  });

  it('visits Coupons page and clicks Add Coupon', () => {
    cy.visit('/marketing/coupons');
    cy.wait('@getCoupons');
    cy.contains('h2', 'Kuponlar').should('be.visible');
    cy.contains('button', 'Yeni Kupon').click();
    cy.contains('h3', 'Kupon Yarat').should('be.visible');
    cy.get('input#code').type('SUMMER2026');
    cy.contains('button', 'Yadda saxla').should('be.enabled');
  });

  it('visits Brands page and clicks Add Brand', () => {
    cy.visit('/marketing/brands');
    cy.wait('@getBrands');
    cy.contains('h2', 'Markalar').should('be.visible');
    cy.contains('button', 'Yeni Marka').click();
    cy.contains('h3', 'Marka Əlavə Et').should('be.visible');
    cy.get('input#name').type('Nike Test');
    cy.get('input#slug').type('nike-test');
    cy.contains('button', 'Yadda saxla').should('be.enabled');
  });
});
