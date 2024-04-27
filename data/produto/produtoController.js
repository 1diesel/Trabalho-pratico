// Importa o modelo de Produto
const Produto = require("../produto/produto");

// Define um controlador para manipular operações relacionadas a produtos
function ProdutoController(Produto) {
    // Função para registrar um novo produto na base de dados
    function registrarProduto(produtoData) {
        // Utiliza o método create() do modelo Produto para criar um novo produto
        return Produto.create(produtoData)
            .then((novoProduto) => novoProduto) // Retorna o novo produto criado
            .catch((error) => {
                // Se ocorrer um erro, lança uma exceção com a mensagem de erro
                throw new Error(`Erro ao registrar o produto: ${error.message}`);
            });
    }

    // Função para alterar os dados de um produto existente na base de dados
    function alterarProduto(id, novoProdutoData) {
        // Utiliza o método findByIdAndUpdate() do modelo Produto para encontrar e atualizar o produto pelo ID
        return Produto.findByIdAndUpdate(id, novoProdutoData, { new: true })
            .then((produtoAtualizado) => produtoAtualizado) // Retorna o produto atualizado
            .catch((error) => {
                // Se ocorrer um erro, lança uma exceção com a mensagem de erro
                throw new Error(`Erro ao alterar o produto: ${error.message}`);
            });
    }

    // Função para excluir um produto da base de dados pelo ID
    function excluirProduto(id) {
        // Utiliza o método findByIdAndDelete() do modelo Produto para encontrar e excluir o produto pelo ID
        return Produto.findByIdAndDelete(id)
            .then((produtoExcluido) => produtoExcluido) // Retorna o produto excluído
            .catch((error) => {
                // Se ocorrer um erro, lança uma exceção com a mensagem de erro
                throw new Error(`Erro ao excluir o produto: ${error.message}`);
            });
    }

    // Retorna um objeto com as funções para registrar, alterar e excluir produtos
    return {
        registrarProduto,
        alterarProduto,
        excluirProduto
    };
}

// Exporta o controlador de Produto
module.exports = ProdutoController;
