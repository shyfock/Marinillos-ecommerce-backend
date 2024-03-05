const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    filename: {type: String},
    bucketName: {type: String},
    metadata:{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model("Image", imageSchema);