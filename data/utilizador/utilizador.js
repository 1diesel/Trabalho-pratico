// Importa as bibliotecas necessárias
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const config = require("../../config");
const scopes = require("./scopes"); // Importa os scopes de permissão

// Define o esquema para as funções de autorização
let RoleSchema = new Schema({
  name: { type: String, required: true }, // Nome da função
  scopes: [
    {
      type: String,
      enum: [scopes["read-all"], scopes["read-posts"], scopes["manage-posts"]], // scopes permitidos para a função
    },
  ],
});

// Define o esquema para os utilizadores
const UtilizadorSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  tipo: { type: String, required: true },
  morada: { type: String, required: true },
  telemovel: { type: String, required: true },
  dataNascimento: { type: Date, required: true },
  nif: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: RoleSchema },
});

// Adiciona um método estático ao esquema Utilizador para verificar tokens
UtilizadorSchema.statics.verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    // Verifica o token com base na chave secreta
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err); // Rejeita a promessa se houver erro na verificação do token
      } else {
        resolve(decoded); // Resolve a promessa com os dados decodificados do token
      }
    });
  });
};

// Adiciona um método estático ao esquema Utilizador para encontrar um Utilizador
UtilizadorSchema.statics.findUtilizador = function ({ name, password }) {
  // Procura um utilizador com base no nome e na password fornecidos
  return this.findOne({ name, password });
};

// Compila o modelo Utilizador a partir do esquema definido
const Utilizador = mongoose.model("Utilizador", UtilizadorSchema);

// Exporta o modelo Utilizador
module.exports = Utilizador;
