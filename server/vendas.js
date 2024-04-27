const express = require("express");
const bodyParser = require("body-parser");
const vendas = require("../data/venda/venda");
const controller = require("../data/venda/vendaController");

const vendasRouter = () => {
  let router = express.Router();

  router.use(bodyParser.json());

  router
    .route("/")
    .get((req, res, next) => {
      controller.listarVendas()
        .then(vendas => {
          res.json(vendas.data);
        })
        .catch(err => {
          console.error("Erro ao listar as vendas:", err);
          res.status(500).json({ success: false, message: "Erro ao listar as vendas" });
        });
    })
    .post((req, res, next) => {
      const { nrVenda, cliente, produtos, total, estado } = req.body;
      controller.registrarVenda(nrVenda, cliente, produtos, total, estado)
        .then(resultado => {
          res.status(201).json(resultado);
        })
        .catch(err => {
          console.error("Erro ao registrar a venda:", err);
          res.status(500).json({ success: false, message: "Erro ao registrar a venda" });
        });
    });

  return router;
};

module.exports = vendasRouter;
