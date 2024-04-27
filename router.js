const express = require("express"); // Importa o módulo express para criar rotas

// Importa os módulos das APIs de autenticação, produtos, stock, utilizadores e vendas
let AuthAPI = require("./server/auth");
let ProdutoAPI = require("./server/produtos");
let StockAPI = require("./server/stock");
let UtilizadorAPI = require("./server/utilizadores");
let VendaAPI = require("./server/vendas");

// Função para inicializar a API
function initialize() {
  let api = express(); // Cria uma nova instância do servidor express

  // Define as rotas para cada uma das APIs importadas
  api.use("/auth", AuthAPI()); // Rota para a API de autenticação
  api.use("/produtos", ProdutoAPI()); // Rota para a API de produtos
  api.use("/stock", StockAPI()); // Rota para a API de stock
  api.use("/utilizadores", UtilizadorAPI()); // Rota para a API de utilizadores
  api.use("/vendas", VendaAPI()); // Rota para a API de vendas

  return api; // Retorna o servidor express com as rotas configuradas
}

module.exports = { initialize: initialize }; // Exporta a função de inicialização da API
