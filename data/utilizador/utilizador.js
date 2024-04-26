var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UtilizadorSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tipo: { type: String, required: true },
    nome: { type: String, required: true },
    morada: { type: String, required: true },
    telemovel: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    nif: { type: String, required: true },
    email: { type: String, required: true }
});

var Utilizador = mongoose.model("Utilizador", UtilizadorSchema);

module.exports = Utilizador;