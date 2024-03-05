const Product = require('../models/Product');
const dbConfig = require("../config/db");
const MongoClient = require("mongodb").MongoClient;

const url = dbConfig.url;
const PORT = process.env.PORT;

const baseUrl = `http://localhost:${PORT}/files/`;

const mongoClient = new MongoClient(`${url}`);

const productCreate = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        productRef: req.body.productRef,
        stock: req.body.stock,
        available: req.body.stock > 0 ? true : false,
        description: req.body.description,
        category: req.body.category
    })

    try {
        const productToSave = await product.save();
        res.status(200).json(productToSave)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getProducts = async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const updateProduct = req.body;
        const options = { new: true };

        const result = await Product.findByIdAndUpdate(
            id, updateProduct, options
        )
        res.send(result)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        res.send(`Document with ${product.name} has been deleted...`)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const getProductImages = async (req, res) => {
    try {
        await mongoClient.connect();
        return await Product.findById(req.params.id)
        .populate("images", "metadata")
        .exec();
        
    } catch(err) {
        res.status(500).json({message: err.message})
    }
    // try {
    //     let dbo = mongoClient.db("marinillos");
    //     dbo.collection("products").aggregate([
    //         { $lookup: 
    //             {
    //                 from: "photos.files",
    //                 localField: '_id',
    //                 foreignField: "metadata.productRef",
    //                 as: "photos"
    //             }
    //         }
    //     ]).toArray(function(err, res) {
    //         if (err) throw err;
    //         console.log(JSON.stringify(res));
    //         db.close();
    //     })
    //     res.json({
    //         prodID: req.params.id,
    //     })
        //console.log(res)
    // } catch(err) {
    //     res.status(400).json({message: err.message})
    // }
}

module.exports = {
    productCreate,
    getProducts,
    getOneProduct,
    getProductImages,
    updateProduct,
    deleteProduct,
}