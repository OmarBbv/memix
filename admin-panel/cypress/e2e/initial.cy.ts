describe('Initial Test', () => {
  it('successfully loads the app', () => {
    cy.visit('/');
    // Check if the page has something recognizable
    // For example, checking for a common element in TailAdmin
    cy.get('body').should('be.visible');
  });
});
