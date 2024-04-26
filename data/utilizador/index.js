const utilizadorService = require("./utilizadorService");

// Access the createToken and utilizadorService properties from the utilizadorService object
const { createToken, utilizadorService: service } = utilizadorService;

module.exports = { createToken, service };