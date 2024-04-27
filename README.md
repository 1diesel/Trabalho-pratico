### Sistema de Gestão de Produtos e Vendas
#
# Este é um sistema de gestão de produtos e vendas desenvolvido com Node.js, Express e MongoDB para um trabalho pratico da unidade curricular de Programação para a web. Permite o registo, modificação, eliminação e listagem de produtos, bem como o registo e listagem de vendas.
# Instalação
# 
#     Certifica-te de que tens o Node.js e o MongoDB instalados no teu computador.
#     Clona este repositório utilizando o comando git clone.
#     Na pasta principal do projeto, executa npm install para instalar todas as dependências.
#
### Utilização
# Para iniciar o servidor, executa o comando npm start. O servidor estará disponível em http://localhost:3000.
# Rotas de Produto
#
#    GET /produtos: Devolve uma lista de todos os produtos registados.
#    POST /produtos: Cria um novo produto com base nos dados fornecidos no corpo do pedido.
#    GET /produtos/:id: Devolve os detalhes de um produto específico com base no ID fornecido.
#    PUT /produtos/:id: Atualiza um produto existente com base no ID fornecido e nos dados fornecidos no corpo do pedido.
#    DELETE /produtos/:id: Elimina um produto existente com base no ID fornecido.
#
### Rotas de Venda
#
#    GET /vendas: Devolve uma lista de todas as vendas registadas.
#    POST /vendas: Regista uma nova venda com base nos dados fornecidos no corpo do pedido.
#
### Rotas de Stock
#    POST /stock: Adiciona um novo movimento de stock (entrada/saída) com base nos dados fornecidos no corpo do pedido.
#
# Rotas de Utilizadores
# POST /utilizadores: lida com operações relacionadas aos utilizadores do sistema, como criar um novo utilizador, autenticar um utilizador existente e verificar as autorizações de um utilizador e permite a criação de novos utilizadores, a autenticação de utilizadores existentes através de um processo de login e a verificação das autorizações de acesso para determinadas rotas.
# POST /auth/login: é feito para esta rota com as credenciais de um utilizador (nome de utilizador e senha), o servidor verifica se essas credenciais correspondem a um utilizador existente na base de dados e se as credenciais estiverem corretas, a rota gera um token de autenticação JWT e retorna no corpo da resposta.
#
### Estrutura do Projeto
# O projeto está estruturado da seguinte forma:
#
#    server: Contém os ficheiros relacionados com o servidor Express.
#    data: Contém os modelos e controladores para as entidades Produto, Venda e Stock.
#    router: Contém os roteadores para as diferentes entidades.
#
### Contribuição
# Este trabalho foi realizado por Daniel Silva (8230457) e Tiago Ferreira (8230793)