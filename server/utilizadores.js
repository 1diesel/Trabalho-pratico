const express = require("express"); // Importa o módulo express para criar rotas
const bodyParser = require("body-parser"); // Importa o módulo body-parser para processar o corpo das requisições
const Utilizador = require("../data/utilizador/utilizador"); // Importa o modelo Utilizador

// Função para criar o router de utilizador
const utilizadorRouter = () => {
  let router = express.Router(); // Cria um novo router express

  router.use(bodyParser.json({ limit: "100mb" })); // Middleware para processar JSON com limite de tamanho
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true })); // Middleware para processar URL com limite de tamanho

  // Middleware de autenticação
  router.use(async (req, res, next) => {
    const token = req.headers["x-access-token"]; // Obtém o token do cabeçalho da requisição
    if (!token) {
      return res.status(401).json({ auth: false, message: "No token provided." }); // Retorna erro de não autorizado se o token não for fornecido
    }
    try {
      const decoded = await Utilizador.verifyToken(token); // Verifica o token com a função verifyToken do Utilizador
      req.user = decoded; // Armazena as informações do utilizador decodificado no objeto de requisição
      next(); // Passa para o próximo middleware
    } catch (err) {
      return res.status(500).json({ auth: false, message: "Failed to authenticate token." }); // Retorna erro interno do servidor se houver falha na autenticação do token
    }
  });

  // Rotas para manipulação de utilizadores
  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const utilizadores = await Utilizador.find(); // Encontra todos os utilizadores
        res.json(utilizadores); // Retorna os utilizadores encontrados
      } catch (err) {
        next(err); // Passa o erro para o próximo middleware
      }
    })
    .post(async (req, res, next) => {
      try {
        const utilizador = await Utilizador.create(req.body); // Cria um novo utilizador com os dados fornecidos
        res.status(201).json(utilizador); // Retorna o utilizador criado com status 201 (Created)
      } catch (err) {
        next(err); // Passa o erro para o próximo middleware
      }
    });

  return router; // Retorna o router
};

module.exports = utilizadorRouter; // Exporta o router de utilizador
