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

    selectOptionByLabel('Nationality',  'Afghan');
    cy.wait(1000); //time to avoid overlapping and let items to be visible
    selectOptionByLabel('Marital Status', 'Married');
    cy.wait(1000); //time to avoid overlapping and let items to be visible

    fillDateByLabel('Date of Birth', '1990-01-15');

    cy.contains('label', 'Gender').parent().siblings('div').find('.oxd-input-group').first().find('input[type="radio"][value="1"]').check({ force: true });

    cy.screenshot('4-2-OrangeHRM-Editar-Personal-Details');
    cy.get('button:contains("Save")').click({ multiple: true });
    cy.contains('Successfully Updated', { timeout: 1000 }).should('exist');
    cy.screenshot('4-3-OrangeHRM-Editar-Personal-Details');
    
  });

  it('Agregar y guardar la información de Custom Fields: Llenar los campos y dar clic en el botón guardar', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.get('div.orangehrm-custom-fields', { timeout: 1000 }).contains('h6.orangehrm-main-title', 'Custom Fields').scrollIntoView();
    //
    cy.get('div.orangehrm-custom-fields form.oxd-form', { timeout: 1000 }).first().within(() => {
      cy.get('div.oxd-select-text-input', { timeout: 1000 }).first().click().parent().parent().contains('div.oxd-select-option', 'O+').click();
      cy.get('input.oxd-input').clear().type('Test Data Hola');
        cy.get('button:contains("Save")').click({ multiple: true });
        cy.screenshot('5-OrangeHRM-Editar-Custom-Fields');
    });
  });

  // ── 2. Attachments (subir, editar, descargar, eliminar) ───────────────────
  it('Realizar acciones en Attachments: cargar, editar, descargar y eliminar', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.get('h6:contains("Attachments")', { timeout: 1000 }).scrollIntoView();
    cy.get('div.orangehrm-attachment').within(() => {
        /* ========== 1. Upload ========== */
        cy.contains('button', 'Add').click();
        cy.get('input[type="file"]').selectFile('cypress/sample-avatar.png', {
          force: true,                   // input oculto
        });
        cy.get('textarea[placeholder="Type comment here"]').type('Adjunto subido por Cypress');
        cy.screenshot('6-1-OrangeHRM-Attachments');
        cy.contains('button', 'Save').click();
        cy.screenshot('6-2-OrangeHRM-Attachments');
      });

    cy.get('.oxd-toast').should('contain.text', 'Successfully Saved');

    /* ========== 2. Editar comentario ========== */
    cy.wait(2000);
    cy.get('i.bi-pencil-fill').first().should('exist').parent().click();

    cy.get('textarea').clear().type('Comentario EDITADO por Cypress');
    cy.screenshot('6-3-OrangeHRM-Attachments');
    cy.get('button:contains("Save")').click({ multiple: true });
    cy.screenshot('6-4-OrangeHRM-Attachments');
    cy.get('.oxd-toast').should('contain.text', 'Successfully Updated');

    /* ========== 3. Descargar archivo ========== */
    cy.get('.oxd-table-body .oxd-table-row', { timeout: 10000 }).first().within(() => {
      cy.get('i.bi-download').should('exist').click();
      cy.screenshot('6-5-OrangeHRM-Attachments');
    });

    /* ========== 4. Eliminar ========== */
    cy.get('.oxd-table-body .oxd-table-row').first().within(() => {
      cy.get('i.bi-trash').click();
      cy.screenshot('6-6-OrangeHRM-Attachments');
    });

    cy.contains('button', 'Yes, Delete').click();
    cy.screenshot('6-7-OrangeHRM-Attachments');
    cy.get('.oxd-toast').should('contain.text', 'Successfully Deleted');
    cy.screenshot('6-8-OrangeHRM-Attachments');
  });

  it('Hacer logout: el usuario debe salir del dashboard', () => {
    cy.login();
    cy.get('a[href="/web/index.php/pim/viewMyDetails"]').click();
    cy.get('p.oxd-userdropdown-name').click();
    cy.contains('Logout').click();
    cy.screenshot('7-0-OrangeHRM-Logout');
    cy.wait(20000);
    cy.screenshot('7-1-OrangeHRM-Logout');
    cy.get('[name="username"]').should('exist');
  });

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
    .find('.oxd-select-wrapper')
    .click()
    .contains('div.oxd-select-option', option)
    .click();
}
