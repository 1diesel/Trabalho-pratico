const express = require("express"); // Importa o módulo express para criar rotas
const bodyParser = require("body-parser"); // Importa o módulo body-parser para processar o corpo das requisições
const Produto = require("../data/produto/produto"); // Importa o modelo Produto
const router = require("../router"); // Importa o módulo router

// Função para criar o router de produtos
const produtoRouter = () => {
  let router = express.Router(); // Cria um novo router express

  router.use(bodyParser.json()); // Middleware para processar JSON

  // Rota para listar todos os produtos
  router.route("/").get((req, res, next) => {
    Produto.find() // Encontra todos os produtos
      .then(produtos => {
        res.json(produtos); // Retorna os produtos encontrados
      })
      .catch(err => {
        next(err); // Passa o erro para o próximo middleware
      });
  })
  // Rota para criar um novo produto
  .post((req, res, next) => {
    console.log("Recebido pedido POST para criar um novo produto:", req.body);
    Produto.create(req.body) // Cria um novo produto com os dados fornecidos
      .then(produto => {
        res.status(201).json(produto); // Retorna o produto criado com status 201 (Created)
      })
      .catch(err => {
        next(err); // Passa o erro para o próximo middleware
      });
  });

  // Rota para obter, atualizar e eliminar um produto específico
  router.route("/:id")
    .get((req, res, next) => {
      Produto.findById(req.params.id) // Encontra o produto pelo ID
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado"); // Retorna um erro se o produto não for encontrado
            return;
          }
          res.json(produto); // Retorna o produto encontrado
        })
        .catch(err => {
          next(err); // Passa o erro para o próximo middleware
        });
    })
    .put((req, res, next) => {
      Produto.findByIdAndUpdate(req.params.id, req.body, { new: true }) // Atualiza o produto pelo ID com os novos dados fornecidos
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado"); // Retorna um erro se o produto não for encontrado
            return;
          }
          res.json(produto); // Retorna o produto atualizado
        })
        .catch(err => {
          next(err); // Passa o erro para o próximo middleware
        });
    })
    .delete((req, res, next) => {
      Produto.findByIdAndDelete(req.params.id) // Elimina o produto pelo ID
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado"); // Retorna um erro se o produto não for encontrado
            return;
          }
          res.sendStatus(204); // Retorna um status 204 (No Content) para indicar que o produto foi eliminado com sucesso
        })
        .catch(err => {
          next(err); // Passa o erro para o próximo middleware
        });
    });

  return router; // Retorna o router
};

module.exports = produtoRouter; // Exporta o router de produtos