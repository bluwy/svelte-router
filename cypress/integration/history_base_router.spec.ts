describe('history base router', { baseUrl: 'http://localhost:10003' }, () => {
  it('should render initial route', () => {
    cy.visit('/test')
    cy.get('h2').contains('Home').should('exist')
  })

  it('should change pathname on route change', () => {
    cy.visit('/test')
    cy.get('a').contains('Null').click()
    cy.location('pathname').should('eq', '/test/null')
    cy.get('h2').contains('404').should('exist')
  })

  it('should handle nested routes', () => {
    cy.visit('/test/profile/123')
    cy.get('h2').contains('Profile').should('exist')
  })

  it('should handle programmatic navigation', () => {
    cy.visit('/test')
    cy.get('#profile-id').type('123')
    cy.get('#profile-button').click()
    cy.contains('Your ID is 123').should('exist')
    cy.location('pathname').should('eq', '/test/profile/123/welcome')
  })

  it('should handle param shorthand paths', () => {
    cy.visit('/test/profile/123')
    cy.get('a').contains('Welcome').click()
    cy.contains('Your ID is 123').should('exist')
    cy.location('pathname').should('eq', '/test/profile/123/welcome')
  })

  it('should display correct href for link component', () => {
    cy.visit('/test/profile/123')
    cy.get('a')
      .contains('Welcome')
      .should('have.attr', 'href')
      .and('eq', '/test/profile/123/welcome')
  })

  it('should redirect', () => {
    cy.visit('/test/secret')
    cy.location('pathname').should('eq', '/test')
    cy.get('h2').contains('Home').should('exist')
  })

  it('should not redirect if undefined', () => {
    cy.visit('/test/profile/123/bio')
    cy.get('h3').contains('Bio').should('exist')
  })

  it('should dynamically import a route', () => {
    cy.visit('/test')
    cy.get('a').contains('Dynamic').click()
    cy.contains('Dynamic import').should('exist')
  })

  it('should handle nested route transitions', () => {
    cy.visit('/test')
    cy.get('a').contains('Transition').click()
    cy.contains('Transition test').should('exist')
    cy.get('a').contains('Home').click()
    cy.contains('Transition test').should('not.exist')
  })
})
