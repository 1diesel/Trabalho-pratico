const bodyParser = require("body-parser"); // Importa o body-parser para processar o corpo das requisições
const express = require("express"); // Importa o express para criar as rotas
const Utilizador = require("../data/utilizador/utilizador"); // Importa o modelo Utilizador
const { utilizadorCreate } = require("../data/utilizador/utilizadorService"); // Importa utilizadorService

const utilizadorService = utilizadorCreate(Utilizador); // Passa o modelo Utilizador para utilizadorCreate

function AuthRouter() {
  let router = express(); // Cria um novo router express

  // Middleware para processar JSON
  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  // Rota para obter informações do utilizador atual
  router.route("/me").get(function (req, res, next) {
    let token = req.headers["x-access-token"]; // Obtém o token do cabeçalho da requisição

    if (!token) {
      return res
        .status(401)
        .send({ auth: false, message: "No token provided." }); // Retorna um erro se o token não foi fornecido
    }
    return Utilizador.verifyToken(token) // Verifica o token
      .then((decoded) => {
        console.log(decoded);
        res.status(202).send({ auth: true, decoded }); // Retorna as informações do utilizador decodificadas
      })
      .catch((err) => {
        res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." }); // Retorna um erro se falhar na autenticação
        next(err);
      });
  });

  // Rota para registar um novo utilizador
  router.route("/registar").post(function (req, res, next) {
    const body = req.body; // Obtém os dados do corpo da requisição
    console.log("Utilizador:", body);
    utilizadorService
      .create(body) // Chama a função create de utilizadorService para registar o novo utilizador
      .then(() => utilizadorService.createToken(body)) // Cria um token para o novo utilizador
      .then((response) => {
        res.status(200).send(response); // Retorna uma resposta de sucesso com o token
      })
      .catch((err) => {
        res
          .status(500)
          .send({ auth: false, message: "Failed to register user." }); // Retorna um erro se falhar o registo
        next(err);
      });
  });

  // Rota para efetuar login
  router.route("/login").post(function (req, res, next) {
    let body = req.body; // Obtém os dados do corpo da requisição
    console.log("Login para o Utilizador: ", body);
    utilizadorService
      .findUtilizador(body) // Procura o utilizador com os dados fornecidos
      .then((utilizador) => {
        if (!utilizador) {
          return res
            .status(404)
            .send({ auth: false, message: "User not found." }); // Retorna um erro se o utilizador não for encontrado
        }
        return utilizadorService.createToken(utilizador); // Cria um token para o utilizador
      })
      .then((response) => {
        res.status(200).send(response); // Retorna uma resposta de sucesso com o token
      })
      .catch((err) => {
        res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate user." }); // Retorna um erro se falhar a autenticação
        next(err);
      });
  });

  return router; // Retorna o router
}

module.exports = AuthRouter; // Exporta o AuthRouter
