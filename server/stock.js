const express = require("express"); // Importa o módulo express para criar rotas
const bodyParser = require("body-parser"); // Importa o módulo body-parser para processar o corpo das requisições
const Stock = require("../data/stock/stock"); // Importa o modelo Stock
const Produto = require("../data/produto/produto"); // Importa o modelo Produto
const stockController = require("../data/stock/stockController"); // Importa o controlador de stock

// Função para criar o router de stock
const stockRouter = () => {
  let router = express.Router(); // Cria um novo router express
  let controller = stockController(Stock, Produto); // Cria uma instância do controlador de stock

  router.use(bodyParser.json()); // Middleware para processar JSON

  // Rota para obter todos os registros de movimento de stock
  router.route("/").get(async (req, res, next) => {
    try {
      const stock = await Stock.find(); // Encontra todos os registros de movimento de stock
      res.json(stock); // Retorna os registros encontrados
    } catch (err) {
      next(err); // Passa o erro para o próximo middleware
    }
  })
  // Rota para adicionar um novo movimento de stock (entrada/saída)
  .post(async (req, res, next) => {
    try {
      const mensagem = await controller.adicionarMovimentoStock(req.body); // Chama a função para adicionar movimento de stock do controlador
      res.status(201).json({ message: mensagem }); // Retorna uma mensagem de sucesso com status 201 (Created)
    } catch (err) {
      next(err); // Passa o erro para o próximo middleware
    }
  });

  return router; // Retorna o router
};

module.exports = stockRouter; // Exporta o router de stock