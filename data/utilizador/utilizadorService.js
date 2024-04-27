const config = require("../../config");
const jwt = require("jsonwebtoken");

function createToken(utilizador) {
    let token = jwt.sign(
        { id: utilizador._id, name: utilizador.name },
        config.secret,
        {
            expiresIn: config.expiresPassword,
        }
    );
    return { auth: true, token };
}

function utilizadorCreate(utilizadorModel) {
    let service = {
        create,
        createToken,
        verifyToken,
        findUtilizador
    };

    function create(utilizador) {
        let novoUtilizador = new utilizadorModel(utilizador);
        return save(novoUtilizador);
    }

    function save(model) {
        return new Promise(function (resolve, reject) {
            model
                .save()
                .then(() => resolve("Utilizador criado!"))
                .catch((err) => reject(`Ocorreu um erro com a criação de utilizadores ${err}`));
        });
    }

    function findUtilizador({ name, password }) {
        return new Promise(function (resolve, reject) {
            utilizadorModel.findOne({ name, password })
                .then((utilizador) => {
                    if (!utilizador) return reject("Utilizador não encontrado");
                    return resolve(utilizador);
                })
                .catch((err) => {
                    reject(`Ocorreu um problema com o login ${err}`);
                });
        });
    }

    return service;
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

module.exports = {
    utilizadorCreate
};
