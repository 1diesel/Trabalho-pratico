// Dependências
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");

// Ligação ao servidor
const hostname = "127.0.0.1";
const port = 3000;

// Arranque do servidor
let router = require("./router");
var app = express();
app.use(router.initialize());
const server = http.Server(app);

// Ligação ao Cluster
mongoose
    .connect(config.db)
    .then(() => console.log("Conexão estabelecida!"))
    .catch((err) => console.error(err));
server.listen(port, hostname, () => {
    console.log(`Endereço do servidor: http://${hostname}:${port}/`);
});