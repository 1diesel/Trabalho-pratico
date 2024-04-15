const express = require("express");
const bodyParser = require("body-parser");
const Produto = require("../data/produto/produto");

const produtoRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(async (req, res, next) => {
            try {
                const produtos = await Produto.find();
                res.json(produtos);
            } catch (err) {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const produto = await Produto.create(req.body);
                res.status(201).json(produto);
            } catch (err) {
                next(err);
            }
        });

    router.route("/:id")
        .get(async (req, res, next) => {
            try {
                const produto = await Produto.findById(req.params.id);
                if (!produto) {
                    res.status(404).send("Produto não encontrado");
                    return;
                }
                res.json(produto);
            } catch (err) {
                next(err);
            }
        })
        .put(async (req, res, next) => {
            try {
                const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
                if (!produto) {
                    res.status(404).send("Produto não encontrado");
                    return;
                }
                res.json(produto);
            } catch (err) {
                next(err);
            }
        })
        .delete(async (req, res, next) => {
            try {
                const produto = await Produto.findByIdAndDelete(req.params.id);
                if (!produto) {
                    res.status(404).send("Produto não encontrado");
                    return;
                }
                res.sendStatus(204);
            } catch (err) {
                next(err);
            }
        });

    return router;
};

module.exports = produtoRouter;