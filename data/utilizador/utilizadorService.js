// Importa as configurações, bibliotecas e módulos necessários
const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define uma função para criar operações relacionadas aos utilizadores
function utilizadorCreate(utilizadorModel) {
  // Cria um objeto de serviço com várias funcionalidades
  let service = {
    create, // Função para criar um novo utilizador
    createToken, // Função para criar um token de autenticação
    verifyToken, // Função para verificar a validade de um token
    findUtilizador, // Função para encontrar um utilizador pelo nome e password
    authorize, // Função para autorizar acesso com base nas permissões do utilizador
  };

  // Função para criar um novo utilizador
  function create(utilizador) {
    // Gera um hash para a password fornecida
    return createPassword(utilizador)
      .then((hashPassword, err) => {
        if (err) {
          return Promise.reject("Não salvo"); // Rejeita a operação se houver erro
        }

        // Adiciona a password hasheada ao objeto do utilizador
        let newUtilizadorWithPassword = {
          ...utilizador,
          password: hashPassword,
        };
        // Cria um novo utilizador com a password hasheada
        let newUtilizador = utilizadorModel(newUtilizadorWithPassword);
        // Salva o novo utilizador na base de dados
        return save(newUtilizador);
      });
  }

  // Função para salvar o utilizador na base de dados
  function save(model) {
    return new Promise(function (resolve, reject) {
      model
        .save() // Salva o modelo na base de dados
        .then(() => resolve("Utilizador criado!")) // Resolve a promessa se a operação for bem-sucedida
        .catch((err) =>
          reject(`Ocorreu um erro com a criação de utilizadores ${err}`)
        ); // Rejeita a promessa se houver erro
    });
  }

  // Função para verificar a validade de um token
  function verifyToken(token) {
    return new Promise((resolve, reject) => {
      // Verifica o token com base na chave secreta
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          reject(err); // Rejeita a promessa se houver erro na verificação do token
        }
        return resolve(decoded); // Resolve a promessa com os dados decodificados do token
      });
    });
  }

  // Função para autorizar acesso com base nas permissões do utilizador
  function authorize(scopes) {
    return (request, response, next) => {
      const { roleUtilizador } = request;
      console.log("route scopes:", scopes);
      console.log("user scopes:", roleUtilizador);

      // Verifica se o utilizador tem autorização para aceder à rota com base nas permissões
      const hasAuthoritization = scopes.some((scope) =>
        roleUtilizador.includes(scopes)
      );

      if (roleUtilizador && hasAuthoritization) {
        next(); // Permite o acesso à próxima função middleware
      } else {
        response
          .status(403)
          .json({ message: "Forbidden" }); // Responde com um código de acesso proibido
      }
    };
  }

  // Função para criar um token de autenticação
  function createToken(utilizador) {
    // Cria um token com base nos dados do utilizador e na chave secreta
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
    // Retorna o token criado
    return { auth: true, token };
  }

  // Função para criar um hash para a password
  function createPassword(utilizador) {
    return bcrypt.hash(utilizador.password, config.saltRounds);
  }

  // Função para comparar a password fornecida com o hash armazenado
  function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  // Função para encontrar um utilizador pelo nome e password
  function findUtilizador({ name, password }) {
    return new Promise(function (resolve, reject) {
      // Procura um utilizador com base no nome fornecido
      utilizadorModel
        .findOne({ name })
        .then((utilizador) => {
          if (!utilizador) return reject("Utilizador não encontrado"); // Rejeita a promessa se o utilizador não for encontrado
          // Compara a password fornecida com a password hasheada armazenada
          return comparePassword(password, utilizador.password).then(
            (match) => {
              if (!match) return reject("O Utilizador não é válido"); // Rejeita a promessa se as passwords não coincidirem
              return resolve(utilizador); // Resolve a promessa com os dados do utilizador se a autenticação for bem-sucedida
            }
          );
        })
        .catch((err) => {
          reject(`Ocorreu um problema com o login ${err}`); // Rejeita a promessa se houver erro durante o processo de autenticação
        });
    });
  }

  return service; // Retorna o objeto de serviço com as funcionalidades
}

// Exporta o módulo de criação de utilizadores
module.exports = {
  utilizadorCreate,
};