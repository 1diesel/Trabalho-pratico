const express = require("express");
const bodyParser = require("body-parser");
const Stock = require("../data/stock/stock");
const Produto = require("../data/produto/produto");
const stockController = require("../data/stock/stockController");

const stockRouter = () => {
  let router = express.Router();
  let controller = stockController(Stock, Produto);

  router.use(bodyParser.json());

  router
    .route("/")
    // Obter todos os registros de movimento de stock
    .get(async (req, res, next) => {
      try {
        const stock = await Stock.find();
        res.json(stock);
      } catch (err) {
        next(err);
      }
    })
    // Adicionar um novo movimento de stock (entrada/saída)
    .post(async (req, res, next) => {
      try {
        const mensagem = await controller.adicionarMovimentoStock(req.body);
        res.status(201).json({ message: mensagem });
      } catch (err) {
        next(err);
      }
    });

  return router;
};

module.exports = stockRouter;
