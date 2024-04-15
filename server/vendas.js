const express = require("express");
const bodyParser = require("body-parser");
const Venda = require("../data/venda/venda");

const vendasRouter = () => {
    let router = express.Router();

    router.use(bodyParser.json());

    router.route("/")
        .get(async (req, res, next) => {
            try {
                const vendas = await Venda.find();
                res.json(vendas);
            } 
                catch (err) 
            {
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const venda = await Venda.create(req.body);
                res.status(201).json(venda);
            } catch (err) {
                next(err);
            }
        });

    return router;
};

module.exports = vendasRouter;