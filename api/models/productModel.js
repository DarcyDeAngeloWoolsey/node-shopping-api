const mongoose = require('mongoose');

//if you want to product to always have an image, makes sure you set it to true
//this means that when posting, we need a way to store a product Image as part of our new product in our post routes
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    productImage: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);