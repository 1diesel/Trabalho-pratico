// data/produto/produtoController.js
const Produto = require("../produto/produto");

function ProdutoController(Produto) {
    function registrarProduto(produtoData) {
        return Produto.create(produtoData)
            .then((novoProduto) => novoProduto)
            .catch((error) => {
                throw new Error(`Erro ao registrar o produto: ${error.message}`);
            });
    }

    function alterarProduto(id, novoProdutoData) {
        return Produto.findByIdAndUpdate(id, novoProdutoData, { new: true })
            .then((produtoAtualizado) => produtoAtualizado)
            .catch((error) => {
                throw new Error(`Erro ao alterar o produto: ${error.message}`);
            });
    }

    function excluirProduto(id) {
        return Produto.findByIdAndDelete(id)
            .then((produtoExcluido) => produtoExcluido)
            .catch((error) => {
                throw new Error(`Erro ao excluir o produto: ${error.message}`);
            });
    }

    return {
        registrarProduto,
        alterarProduto,
        excluirProduto
    };
}

module.exports = ProdutoController;