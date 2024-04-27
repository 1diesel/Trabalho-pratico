function vendaController(VendaModel, ProdutoModel) {
    let controller = {};
  
    // Função para registrar uma nova venda
    controller.registrarVenda = (nrVenda, cliente, produtos, total, estado) => {
      return VendaModel.create({ nrVenda, cliente, produtos, total, estado }) // Cria uma nova venda com os dados fornecidos
        .then(() => {
          // Reduz a quantidade vendida de cada produto no estoque
          const updateStockPromises = produtos.map((produtoId) => {
            return ProdutoModel.findByIdAndUpdate(produtoId, {
              $inc: { quantidade: -1 }, // Reduz a quantidade do produto em 1 unidade
            });
          });
          return Promise.all(updateStockPromises);
        })
        .then(() => {
          return { success: true, message: "Venda registada com sucesso" }; // Retorna uma mensagem de sucesso
        })
        .catch((error) => {
          console.error("Erro ao registar a venda:", error); // Regista um erro caso ocorra
          return { success: false, message: "Erro ao registar a venda" }; // Retorna uma mensagem de erro
        });
    };
  
    // Função para listar todas as vendas
    controller.listarVendas = () => {
      return VendaModel.find() // Encontra todas as vendas
        .populate("produtos") // Preenche os produtos associados a cada venda
        .then((vendas) => {
          return { success: true, data: vendas }; // Retorna as vendas encontradas
        })
        .catch((error) => {
          console.error("Erro ao obter as vendas:", error); // Regista um erro caso ocorra
          return { success: false, message: "Erro ao obter as vendas" }; // Retorna uma mensagem de erro
        });
    };
  
    // Função para listar movimentações de estoque de um produto específico
    controller.movimentacoesDeStock = (produtoId) => {
      return VendaModel.find({ produtos: produtoId }) // Encontra as vendas que contêm o produto específico
        .populate("produtos") // Preenche os produtos associados a cada venda
        .then((movimentacoes) => {
          return { success: true, data: movimentacoes }; // Retorna as movimentações de estoque encontradas
        })
        .catch((error) => {
          console.error("Erro ao obter as movimentações de stock:", error); // Regista um erro caso ocorra
          return {
            success: false,
            message: "Erro ao obter as movimentações de stock", // Retorna uma mensagem de erro
          };
        });
    };
  
    return controller; // Retorna o controlador de vendas
  }
  