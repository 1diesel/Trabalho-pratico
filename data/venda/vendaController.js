function vendaController(VendaModel, ProdutoModel) {
  let controller = {};

  // Função para registrar uma nova venda
  controller.registrarVenda = (nrVenda, cliente, produtos, total, estado) => {
    return VendaModel.create({ nrVenda, cliente, produtos, total, estado })
      .then(() => {
        // Reduzir a quantidade vendida de cada produto no estoque
        const updateStockPromises = produtos.map((produtoId) => {
          return ProdutoModel.findByIdAndUpdate(produtoId, {
            $inc: { quantidade: -1 },
          });
        });
        return Promise.all(updateStockPromises);
      })
      .then(() => {
        return { success: true, message: "Venda registada com sucesso" };
      })
      .catch((error) => {
        console.error("Erro ao registar a venda:", error);
        return { success: false, message: "Erro ao registar a venda" };
      });
  };

  // Função para listar todas as vendas
  controller.listarVendas = () => {
    return VendaModel.find()
      .populate("produtos")
      .then((vendas) => {
        return { success: true, data: vendas };
      })
      .catch((error) => {
        console.error("Erro ao obter as vendas:", error);
        return { success: false, message: "Erro ao obter as vendas" };
      });
  };

  // Função para listar movimentações de estoque de um produto específico
  controller.movimentacoesDeStock = (produtoId) => {
    return VendaModel.find({ produtos: produtoId })
      .populate("produtos")
      .then((movimentacoes) => {
        return { success: true, data: movimentacoes };
      })
      .catch((error) => {
        console.error("Erro ao obter as movimentações de stock:", error);
        return {
          success: false,
          message: "Erro ao obter as movimentações de stock",
        };
      });
  };

  return controller;
}
