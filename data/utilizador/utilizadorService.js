const config = require("../../config");
const jwt = require("jsonwebtoken");

function createToken(utilizador) {
    let token = jwt.sign(
        { id: utilizador._id, name: utilizador.name},
        config.secret,
        {
            expiresIn: config.expiresPassword,
        }
    );
    return { auth: true, token };
}

function utilizadorService(utilizadorModel) {
    let service = {
        create,
    };

    function create(utilizador) {
        let novoUtilizador = utilizadorModel(utilizador);
        return save (novoUtilizador);
    }

    function save(model) {
        return new Promise (function (resolve, reject) {
            model
                .save()
                .then(() => resolve("Utilizador criado!"))
                .catch((err) => reject (`Ocorreu um erro com a criação de utilizadores ${err}`));
        });
    }

    return service;
}

module.exports = {
    createToken,
    utilizadorService
};