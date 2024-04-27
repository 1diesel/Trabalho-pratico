// Importa o modelo de Stock
const stock = require("./stock");

// Define um controlador para manipular operações relacionadas ao stock
function stockController(StockModel) {
  let controller = {};

  // Função para adicionar um movimento de stock (entrada/saída)
  controller.adicionarMovimentoStock = (dadosStock) => {
    // Determina o tipo de movimento com base na quantidade fornecida
    const movimento = dadosStock.quantidade > 0 ? "entrada" : "saída";
    // Cria um novo objeto de stock com os dados fornecidos
    const novoStock = new StockModel({
      ref: dadosStock.ref,
      movimento: movimento,
      quantidade: Math.abs(dadosStock.quantidade), // Garante que a quantidade é positiva
      idProduto: dadosStock.idProduto,
      data: new Date(),
      anotacoes: dadosStock.anotacoes || "", // Atribui anotações se fornecidas, caso contrário, atribui uma string vazia
    });

    // Salva o novo movimento de stock na base de dados
    return novoStock.save()
      .then(() => controller.atualizarStock(dadosStock.idProduto)) // Atualiza o stock do produto após adicionar o movimento
      .then(() => "Movimento de stock adicionado com sucesso.") // Retorna uma mensagem de sucesso
      .catch((error) => { throw new Error("Erro ao adicionar movimento de stock: " + error.message); }); // Captura e lança qualquer erro ocorrido durante o processo
  };

  // Função para atualizar a quantidade de stock do produto
  controller.atualizarStock = (idProduto) => {
    return Promise.all([
      // Realiza uma agregação para calcular a quantidade disponível de stock do produto
      StockModel.aggregate([
        { $match: { idProduto: idProduto } },
        { $group: { _id: "$idProduto", total: { $sum: "$quantidade" } } },
      ]),
      // Encontra o último registo de stock relacionado ao produto
      StockModel.findOne({ idProduto: idProduto }).sort({ data: -1 }).limit(1),
    ])
      .then(([quantidadeDisponivel, quantidadeMinima]) => {
        // Atualiza a quantidade disponível e mínima do produto na base de dados
        return idProduto.findByIdAndUpdate(idProduto, {
          quantidadeDisponivel: quantidadeDisponivel.total || 0, // Define a quantidade disponível como a soma total, ou 0 se não houver registros
          quantidadeMinima: quantidadeMinima.quantidade || 0, // Define a quantidade mínima com base no último registo, ou 0 se não houver registros
        });
      })
      .catch((error) => { throw new Error("Erro ao atualizar stock do produto: " + error.message); }); // Captura e lança qualquer erro ocorrido durante o processo
  };

  // Função para verificar alertas de reposição de stock
  controller.verificarAlertasReposicao = () => {
    // Encontra os produtos com quantidade disponível abaixo da quantidade mínima definida
    return Produto.find({ quantidadeDisponivel: { $lt: "$quantidadeMinima" } })
      .then((produtosAlerta) => produtosAlerta) // Retorna a lista de produtos em alerta
      .catch((error) => { throw new Error("Erro ao verificar alertas de reposição: " + error.message); }); // Captura e lança qualquer erro ocorrido durante o processo
  };

  return controller;
}

// Exporta o controlador de stock
module.exports = stockController;
