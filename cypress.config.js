const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "5ohi8g",
  env: {
    apiUrl: 'https://api.qaautomationlabs.com/v1'
  },
  e2e: {
    setupNodeEvents(on, config) {
      baseUrl:'https://api.qaautomationlabs.com/v1/'
      // implement node event listeners here
    },
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true
  }
});
