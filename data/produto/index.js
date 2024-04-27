const Produto = require("./produto");
const produtoController = require("./produtoController");
const service = produtoController(Produto);

module.exports = service;