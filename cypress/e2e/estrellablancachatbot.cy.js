describe('Interact with Estrella Blanca Chatbot', () => {
  //Test Case Goal:
  const url = 'https://estrellablanca.com.mx/';
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    //Since the site contains several xhr request and these are not part of the test objective 
    //let's turn off the logging on the report for better readability

    cy.intercept('**', { log: false });
    cy.visit(url, { failOnStatusCode: false });
  });

  it('should interact with the chatbot in the iframe', () => {
    
    cy.wait(50000); // Giving time for adds to appear
    cy.get('div[id="wps-overlay-close-button"]', { timeout: 50000 }).click()
    cy.log('Closed Initial Adds')

    //Activating the chatbot window
    cy.get('iframe[id="botlers-messaging-button-iframe"]', { timeout: 20000 }).its('0.contentWindow.document').should('exist')
        .then((chatbotIconIframeDoc) => {
          console.log('Chatbot Icon contentWindow Document:', chatbotIconIframeDoc);

          cy.wrap(chatbotIconIframeDoc).find('div[id="open-button"]', { timeout: 15000 }).should('exist', 'Chatbot Button Found').click();
          cy.log('Chatbot Button Clicked')

        }
    );

    //Interacting with the chatbot window
    cy.get('iframe[src*="https://widget.botlers.io/window/index.html?v=219"]', { timeout: 20000 }).its('0.contentWindow.document').should('exist')
        .then((chatbotMessagesIframeDoc) => {
          console.log('Chatbot Messages contentWindow Document:', chatbotMessagesIframeDoc);
          
          cy.wrap(chatbotMessagesIframeDoc).find('textarea.v-field__input:not(.v-textarea__sizer)', { timeout: 25000 }).should('exist', 'Chatbot Textarea Found').type("Hola soy Luis Hernandez! Estoy haciendo una prueba automatizada con el chatbot. Saludos!{enter}");

          cy.wrap(chatbotMessagesIframeDoc).find('#brand', { timeout: 25000 }).find('.v-btn__content').should('contain.text', 'Powered by');
          cy.log('shows the "powered by artificial nerds" brand banner');

          cy.wrap(chatbotMessagesIframeDoc).find('#chat-body', { timeout: 250000 }).find('.v-card-text.py-2.text-break').should('contain.text', 'Hola! Soy Estrella, tu asistente virtual. ⭐');
          cy.log('has at least one message div that says "Hola"');

        }
    );

  });


});
