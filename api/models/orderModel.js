const mongoose = require('mongoose');

//nosequal is not relational so we need to build a relation between order and product
//that is where the ref comes in. we connect the other model with this model

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);