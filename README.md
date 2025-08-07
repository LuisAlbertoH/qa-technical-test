# Prueba técnica QA Engineer

## 🔧 Tecnologías
- Cypress
- JavaScript
- Git / GitHub

## 📁 Estructura

- `/cypress/e2e`: Casos de prueba para OrangeHRM y Chatbot
- `/cypress/support`: Comandos personalizados
- `/cypress/fixtures`: Datos simulados

## ▶️ Instalación

```bash
git clone https://github.com/tuusuario/qa-orangehrm-chatbot.git
cd qa-orangehrm-chatbot
npm install
```

## 🚀 Ejecutar pruebas

```bash
npx cypress open
```

Selecciona los archivos:
- `orangehrm.cy.js`
- `chatbot.cy.js`

## 📌 Notas

- La prueba del chatbot usa interacciones con `iframe`. Dependiendo del tiempo de carga, podrías usar `cy.wait()` estratégicamente.
- Las credenciales válidas para OrangeHRM demo son:
  - Usuario: `Admin`
  - Contraseña: `admin123`

## ✍️ Autor
Luis Alberto Hernández Córdova
