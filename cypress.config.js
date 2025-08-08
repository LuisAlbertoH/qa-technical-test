const { defineConfig } = require("cypress");

module.exports = defineConfig({
	video: true,
	pageLoadTimeout: 120000,
	chromeWebSecurity: false,
	experimentalSessionAndOrigin: true,
	experimentalModifyObstructiveThirdPartyCode: true,
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    supportFile: "cypress/support/e2e.js",
	video: true,
	screenshotOnRunFailure: true
  }, 
  retries: {
          runMode: 0, // Retries failed tests up to 2 times in run mode
          openMode: 0, // Retries failed tests up to 1 time in open mode
        }
});
