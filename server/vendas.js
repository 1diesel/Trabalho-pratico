const express = require("express"); // Importa o módulo express para criar rotas
const bodyParser = require("body-parser"); // Importa o módulo body-parser para processar o corpo das requisições
const vendas = require("../data/venda/venda"); // Importa o modelo de vendas
const controller = require("../data/venda/vendaController"); // Importa o controlador de vendas

// Função para criar o router de vendas
const vendasRouter = () => {
  let router = express.Router(); // Cria um novo router express

  router.use(bodyParser.json()); // Middleware para processar JSON

  // Rotas para manipulação de vendas
  router
    .route("/")
    .get((req, res, next) => {
      controller
        .listarVendas() // Chama a função listarVendas do controlador de vendas
        .then((vendas) => {
          res.json(vendas.data); // Retorna os dados das vendas em formato JSON
        })
        .catch((err) => {
          console.error("Erro ao listar as vendas:", err);
          res
            .status(500)
            .json({ success: false, message: "Erro ao listar as vendas" }); // Retorna erro interno do servidor em caso de falha
        });
    })
    .post((req, res, next) => {
      const { nrVenda, cliente, produtos, total, estado } = req.body; // Extrai os dados da requisição
      controller
        .registrarVenda(nrVenda, cliente, produtos, total, estado) // Chama a função registrarVenda do controlador de vendas
        .then((resultado) => {
          res.status(201).json(resultado); // Retorna o resultado da operação com status 201 (Created)
        })
        .catch((err) => {
          console.error("Erro ao registrar a venda:", err);
          res
            .status(500)
            .json({ success: false, message: "Erro ao registrar a venda" }); // Retorna erro interno do servidor em caso de falha
        });
    });

  return router; // Retorna o router
};

module.exports = vendasRouter; // Exporta o router de vendas
