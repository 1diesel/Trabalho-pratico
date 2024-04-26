const bodyParser = require("body-parser");
const express = require("express");
const { utilizadorService } = require("../data/utilizador/utilizadorService"); // Import utilizadorService

const service = utilizadorService(); // Initialize utilizadorService

function AuthRouter(){
    let router = express();

    router.use(bodyParser.json({ limit: "100mb" }));
    router.use(bodyParser.urlencoded({ limit: "100mb", extended: true}));

    router.route("/registar").post(function (req, res, next) {
        const body = req.body;
        console.log("Utilizador:", body);
        service.create(body) // Call the create function from utilizadorService
        .then(() => service.createToken(body)) // Use service.createToken
        .then((response) => {
            res.status(200);
            console.log("Token do Utilizador:", response);
            res.send(response);
        })
        .catch((err) => {
            res.status(500);
            res.send(err);
            next();
        });
    });

    return router;
}

module.exports = AuthRouter;
