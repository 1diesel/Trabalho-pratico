const express = require("express");

let ProdutoAPI = require("./server/produtos");
let StockAPI = require("./server/stock");
let UtilizadorAPI = require("./server/utilizadores");
let VendaAPI = require("./server/vendas");

function initialize() {
    let api = express();
    api.use("/menu", UtilizadorAPI());

    return api;
}

module.exports = { initialize: initialize };
