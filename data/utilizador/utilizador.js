const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const config = require("../../config");
const scopes = require("./scopes");

let RoleSchema = new Schema({
  name: { type: String, required: true },
  scopes: [
    {
      type: String,
      enum: [scopes["read-all"], scopes["read-posts"], scopes["manage-posts"]],
    },
  ],
});

// Define the Utilizador schema
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

// Add a static method to the Utilizador schema for verifying tokens
UtilizadorSchema.statics.verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Add a static method to the Utilizador schema for finding a Utilizador
UtilizadorSchema.statics.findUtilizador = function ({ name, password }) {
  return this.findOne({ name, password });
};

const Utilizador = mongoose.model("Utilizador", UtilizadorSchema); // Compile the Utilizador model

// Export the Utilizador model
module.exports = Utilizador;
