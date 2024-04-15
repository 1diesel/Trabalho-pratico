const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProdutoSchema = new Schema({
    ref: { type: Number, required: true, unique: true },
    nome: { type: String, required: true },
    preco: { type: Number, required: true },
});

const VendaSchema = new Schema({
    nrVenda: { type: Number, required: true, unique: true },
    cliente: { type: String, required: true },
    produtos: [{ type: Schema.Types.ObjectId, ref: 'Produto' }],
    total: { type: Number, required: true },
    estado: { type: String, required: true },
});

const Venda = mongoose.model("Venda", VendaSchema);

module.exports = Venda;