const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController')


// Post Method
router.post('/post', productController.productCreate)

// Get all Method
router.get('/getAll', productController.getProducts)

// Get by ID Method
router.get('/getOne/:id', productController.getOneProduct)

// Update by ID Method
router.patch('/update/:id', productController.updateProduct)

// Delete by ID Method
router.delete('/delete/:id', productController.deleteProduct)

router.get('/getImages/:id', productController.getProductImages)

module.exports = router;