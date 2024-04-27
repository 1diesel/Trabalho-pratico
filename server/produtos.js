const express = require("express");
const bodyParser = require("body-parser");
const Produto = require("../data/produto/produto");
const router = require("../router");

const produtoRouter = () => {
  let router = express.Router();

  router.use(bodyParser.json());

  router
    .route("/")
    .get((req, res, next) => {
      Produto.find()
        .then(produtos => {
          res.json(produtos);
        })
        .catch(err => {
          next(err);
        });
    })
    .post((req, res, next) => {
      console.log("Recebido pedido POST para criar um novo produto:", req.body);
      Produto.create(req.body)
        .then(produto => {
          res.status(201).json(produto);
        })
        .catch(err => {
          next(err);
        });
    });

  router
    .route("/:id")
    .get((req, res, next) => {
      Produto.findById(req.params.id)
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado");
            return;
          }
          res.json(produto);
        })
        .catch(err => {
          next(err);
        });
    })
    .put((req, res, next) => {
      Produto.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado");
            return;
          }
          res.json(produto);
        })
        .catch(err => {
          next(err);
        });
    })
    .delete((req, res, next) => {
      Produto.findByIdAndDelete(req.params.id)
        .then(produto => {
          if (!produto) {
            res.status(404).send("Produto não encontrado");
            return;
          }
          res.sendStatus(204);
        })
        .catch(err => {
          next(err);
        });
    });

  return router;
};

module.exports = produtoRouter;
