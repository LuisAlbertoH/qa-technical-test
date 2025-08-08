# Prueba técnica QA Engineer

## 🔧 Tecnologías
- Cypress
- JavaScript
- Git / GitHub / GitHub Actions

## 📁 Estructura

- `/cypress/e2e`: Casos de prueba para OrangeHRM y Chatbot
- `/cypress/support`: Comandos personalizados

## ▶️ Instalación

```bash
git clone https://github.com/LuisAlbertoH/qa-technical-test.git
cd qa-technical-test
npm install
```

## 🚀 Ejecutar pruebas

```bash
npx cypress open
```

Selecciona los archivos:
- `orangehrm.cy.js`
- `chatbot.cy.js`

## 📡 Ejecución remota con GitHub Actions

Este repositorio cuenta con una configuración de GitHub Actions que se puede ejecutar de manera manual y remota sin necesidad de ejecutarlo localmente.
En cada ejecución del workflow podrás:
- Revisar el log de cada prueba ejecutada.
- Descargar como attachments los videos de la ejecución.
- Descargar como attachments las capturas de pantalla tomadas durante las pruebas.

Para ejecutar el workflow ve a la seccion de Actions da click en el workflow en el costado izquierdo y selecciona la opcion de Run Workflow del lado izquierdo [Acceso directo](https://github.com/LuisAlbertoH/qa-technical-test/actions/workflows/chatbot-test.yml)

## ✍️ Autor
Luis Alberto Hernández Córdova
