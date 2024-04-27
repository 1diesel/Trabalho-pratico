const { Venda, Produto } = require("./venda");
const vendaController = require("./vendaController");
const service = vendaController(Venda, Produto);

module.exports = service;
