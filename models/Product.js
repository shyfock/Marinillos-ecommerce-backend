const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productRef: {type: String, unique: true, required: true},
    stock: {type: Number, required: true},
    available: {type: Boolean},
    description: {type: String},
    category: {
        type: String,
        enum: [
            "Hogar",
            "Decoración",
            "Juguetería",
            "Piñatería",
            "Navidad"
        ],
        default: "Hogar"
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Image'
        }
    ],
});

module.exports = mongoose.model("Product", ProductSchema);