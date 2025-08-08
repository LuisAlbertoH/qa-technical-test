describe('OrangeHRM - Test de plataforma web', () => {
  const url = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  beforeEach(() => {
    cy.visit(url);
  });

  it('Ingresar credenciales incorrectas: Validar que no se pueda acceder al dashboard cuando el usuario ingrese datos erróneos', () => {
    cy.get('[name="username"]').type('usuario');
    cy.get('[name="password"]').type('invalida');
    cy.get('button[type="submit"]').click();
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
    cy.screenshot('1-OrangeHRM-Credenciales-Incorrectas');
  });

  it('Hacer login: Validar que el usuario pueda acceder al dashboard', () => {
    cy.get('[name="username"]').type('Admin');
    cy.get('[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.wait(1000); //allowing time for page to load and do assert
    cy.url().should('include', '/dashboard');
    cy.screenshot('2-OrangeHRM-Credenciales-Exitoso');
  });

  it('Acceder a la sección My info: Validar que las opciones del menú existan en el dashboard, acceder a la sección y obtener el texto de Personal Details', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.contains('Personal Details').should('exist');

    const expectedTabs = [
      'Personal Details',
      'Contact Details',
      'Emergency Contacts',
      'Dependents',
      'Immigration',
      'Job',
      'Salary',
      'Report-to',
      'Qualifications',
      'Memberships',
    ];

    cy.get('div.orangehrm-edit-employee-content', { timeout: 1000 }).contains('h6.orangehrm-main-title', 'Personal Details').should('be.visible')
    cy.screenshot('3-1-OrangeHRM-Seccion-MyInfo');

    cy.log("Verificando que las **opciones del menu existen en el dashboard**")
    cy.get('[role="tablist"].orangehrm-tabs').within(() => {
      expectedTabs.forEach((label) => {
        cy.contains('a.orangehrm-tabs-item', label).should('exist').and('be.visible');
      });
    });

    cy.get('[role="tablist"].orangehrm-tabs a.orangehrm-tabs-item').should('have.length', expectedTabs.length);
    
    cy.screenshot('3-OrangeHRM-Seccion-MyInfo');

  });

  it('Agregar y guardar la información de Personal Details: Llenar los campos y dar clic en el botón guardar', () => {
    cy.login();
    cy.screenshot('4-1-OrangeHRM-Editar-Personal-Details');
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();

    cy.get('input[name="firstName"]').clear().type('Luis');

    cy.get('input[name="middleName"]').clear().type('A');

    cy.get('input[name="lastName"]').clear().type('Hernandez');

    fillInputByLabel('Employee Id', '12345');
    fillInputByLabel('Other Id', 'XYZ-99');
    fillInputByLabel("Driver's License Number", 'DL-000001');

    fillDateByLabel('License Expiry Date', '2030-12-31');

    selectOptionByLabel('Nationality',  'Mexican');
    cy.wait(1000); //time to avoid overlapping and let items to be visible
    selectOptionByLabel('Marital Status', 'Married');
    cy.wait(1000); //time to avoid overlapping and let items to be visible

    fillDateByLabel('Date of Birth', '1990-01-15');

    cy.contains('label', 'Gender').parent().find('input[type="radio"][value="1"]').check({ force: true });

    cy.screenshot('4-2-OrangeHRM-Editar-Personal-Details');
    cy.get('button:contains("Save")').click({ multiple: true });
    cy.contains('Successfully Updated', { timeout: 1000 }).should('exist');
    cy.screenshot('4-3-OrangeHRM-Editar-Personal-Details');
  });


  it('Agregar y guardar la información de Custom Fields: Llenar los campos y dar clic en el botón guardar', () => {});
  it('Realizar acciones en la sección de Attachments: Cargar, editar, descargar y eliminar una imagen.', () => {});
  it('Hacer logout: Validar que el usuario pueda salir del dashboard', () => {});
});


/* ============ Helpers reutilizables ============ */

/**
 * Rellena un <input> de texto localizando primero su <label>.
 * @param {string} labelText  Texto exacto del label
 * @param {string} value      Valor que se escribirá
 */
function fillInputByLabel(labelText, value) {
  cy.contains('label', labelText)
    .parent()
    .siblings('div')
    .find('input')
    .clear()
    .type(value);
}

/**
 * Selecciona una fecha en un <input type="text"> con date-picker custom.
 * @param {string} labelText Texto exacto del label
 * @param {string} value     Fecha en formato yyyy-mm-dd
 */
function fillDateByLabel(labelText, value) {
  cy.contains('label', labelText)
    .parent()
    .siblings('div')
    .find('input')
    .clear()
    .type(`${value}`).click();
}

/**
 * Abre el dropdown custom de OrangeHRM y selecciona la opción deseada.
 * @param {string} labelText Texto exacto del label que precede al dropdown
 * @param {string} option    Opción visible a seleccionar
 */
function selectOptionByLabel(labelText, option) {
  // Abre el dropdown
  cy.contains('label', labelText)
    .parent()
    .siblings('div')
    .find('.oxd-select-text')
    .click();

  // Selecciona la opción (ajusta selector si tu lista usa otra clase)
  cy.contains('.oxd-select-dropdown li', option).click();
}
