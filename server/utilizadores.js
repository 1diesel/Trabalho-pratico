const express = require("express");
const bodyParser = require("body-parser");
const Utilizador = require("../data/utilizador/utilizador");

const utilizadorRouter = () => {
  let router = express.Router();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  // Middleware de autenticação
  router.use(async (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res
        .status(401)
        .json({ auth: false, message: "No token provided." });
    }
    try {
      const decoded = await Utilizador.verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
  });

  router
    .route("/")
    .get(async (req, res, next) => {
      try {
        const utilizadores = await Utilizador.find();
        res.json(utilizadores);
      } catch (err) {
        next(err);
      }
    })
    .post(async (req, res, next) => {
      try {
        const utilizador = await Utilizador.create(req.body);
        res.status(201).json(utilizador);
      } catch (err) {
        next(err);
      }
    });

  return router;
};

module.exports = utilizadorRouter;
