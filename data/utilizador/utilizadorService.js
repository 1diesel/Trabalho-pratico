const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function utilizadorCreate(utilizadorModel) {
  let service = {
    create,
    createToken,
    verifyToken,
    findUtilizador,
    authorize,
  };

  function create(utilizador) {
    return createPassword(utilizador).then((hashPassword, err) => {
      if (err) {
        return Promise.reject("Não salvo");
      }

      let newUtilizadorWithPassword = {
        ...utilizador,
        password: hashPassword,
      };
      let newUtilizador = utilizadorModel(newUtilizadorWithPassword);
      return save(newUtilizador);
    });
  }

  function save(model) {
    return new Promise(function (resolve, reject) {
      model
        .save()
        .then(() => resolve("Utilizador criado!"))
        .catch((err) =>
          reject(`Ocorreu um erro com a criação de utilizadores ${err}`)
        );
    });
  }

  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        return resolve(decoded);
      });
    });
  }

  function authorize(scopes) {
    return (request, response, next) => {
        const { roleUtilizador } = request;
        console.log("route scopes:", scopes);
        console.log("user scopes:", roleUtilizador);
        
        const hasAuthoritization = scopes.some((scope) => roleUtilizador.includes(scopes));

        if (roleUtilizador && hasAuthoritization) {
            next();
        } else {
            response.status(403).json({ message: "Forbidden" }); //acesso proibido
        }
    }
  }

  function createToken(utilizador) {
    let token = jwt.sign(
      {
        id: utilizador._id,
        name: utilizador.name,
        role: utilizador.role.scopes,
      },
      config.secret,
      {
        expiresIn: config.expiresPassword,
      }
    );
    return { auth: true, token };
  }

  function createPassword(utilizador) {
    return bcrypt.hash(utilizador.password, config.saltRounds);
  }

  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  function findUtilizador({ name, password }) {
    return new Promise(function (resolve, reject) {
      utilizadorModel
        .findOne({ name })
        .then((utilizador) => {
          if (!utilizador) return reject("Utilizador não encontrado");
          return comparePassword(password, utilizador.password).then(
            (match) => {
              if (!match) return reject("O Utilizador não é valido");
              return resolve(utilizador);
            }
          );
        })
        .catch((err) => {
          reject(`Ocorreu um problema com o login ${err}`);
        });
    });
  }

  return service;
}

module.exports = {
  utilizadorCreate,
};
