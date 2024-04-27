const stock = require("./stock");

function stockController(StockModel) {
  let controller = {};

  // adiciona movimento de stock (entrada/saida)
  controller.adicionarMovimentoStock = (dadosStock) => {
    const movimento = dadosStock.quantidade > 0 ? "entrada" : "saída";
    const novoStock = new StockModel({
      ref: dadosStock.ref,
      movimento: movimento,
      quantidade: Math.abs(dadosStock.quantidade),
      idProduto: dadosStock.idProduto,
      data: new Date(),
      anotacoes: dadosStock.anotacoes || "",
    });

    return novoStock.save()
      .then(() => controller.atualizarStock(dadosStock.idProduto))
      .then(() => "Movimento de stock adicionado com sucesso.")
      .catch((error) => { throw new Error("Erro ao adicionar movimento de stock: " + error.message); });
  };

  // atualiza a quantidade de stock do produto
  controller.atualizarStock = (idProduto) => {
    return Promise.all([
      StockModel.aggregate([
        { $match: { idProduto: idProduto } },
        { $group: { _id: "$idProduto", total: { $sum: "$quantidade" } } },
      ]),
      StockModel.findOne({ idProduto: idProduto }).sort({ data: -1 }).limit(1),
    ])
      .then(([quantidadeDisponivel, quantidadeMinima]) => {
        return idProduto.findByIdAndUpdate(idProduto, {
          quantidadeDisponivel: quantidadeDisponivel.total || 0,
          quantidadeMinima: quantidadeMinima.quantidade || 0,
        });
      })
      .catch((error) => { throw new Error("Erro ao atualizar stock do produto: " + error.message); });
  };

  // verifica alertas de reposição
  controller.verificarAlertasReposicao = () => {
    return Produto.find({ quantidadeDisponivel: { $lt: "$quantidadeMinima" } })
      .then((produtosAlerta) => produtosAlerta)
      .catch((error) => { throw new Error("Erro ao verificar alertas de reposição: " + error.message); });
  };

  return controller;
}

module.exports = stockController;
