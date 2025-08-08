describe('OrangeHRM - Test de plataforma web', () => {
  const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  beforeEach(() => {
    cy.visit(url);
  });

  it('No debe permitir acceso con credenciales incorrectas', () => {
    cy.get('[name="username"]').type('usuario');
    cy.get('[name="password"]').type('invalida');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  it('Login exitoso con credenciales válidas', () => {
    cy.get('[name="username"]').type('Admin');
    cy.get('[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Acceder a "My Info" y validar contenido', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.contains('Personal Details').should('exist');
  });

  it('Editar y guardar Personal Details', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.get('[name="firstName"]').clear().type('Luis');
    cy.get('[name="lastName"]').clear().type('Córdova');
    cy.get('button:contains("Save")').click({ multiple: true });
    cy.contains('Successfully Updated').should('exist');
  });
});

