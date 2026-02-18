describe('Initial Test', () => {
  it('successfully loads the home page', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
