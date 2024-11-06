const { response } = require('express');
const Product = require('../model/product')
const { validationResult } = require('express-validator');

const product = async (req, res) => {
    const user = await Product.find();
    // console.log(user)
    res.json({ msg: "All Data", response: user })
}

// Add Product
const addProduct = async (req, res) => {
    
    // Collect validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, response: errors.array() });
    }
    const userdata = req.body;
    const newProduct = new Product(userdata);
    const savedProduct = await newProduct.save();
    Product.create(newProduct, (err) => {
        if (err) {
            return res.json({ status: false, response: err })
        } else {
            return res.json({ status: true, response: 'Product added successfully', product: savedProduct });
        }
    })
};


// Update product
const updateProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, response: errors.array() });
    }
    const { user_id } = req.body; 
    // if(!user_id){
    //     return res.json({status:false, response:"user_id not exist"})
    // }
    const { name, price, brand, quantity, expiryDate, purchasePrice, sellingPrice } = req.body;
    const updatedData = {
        name: name, price: price, brand: brand, quantity:quantity,
        expiryDate: expiryDate, purchasePrice: purchasePrice,
        sellingPrice:sellingPrice }; 
    await Product.updateProducts(user_id, updatedData);
    res.json({ status: true, message: 'Product updated' });

};
//  Delete Product
const deleteProduct = async (req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json({ status: false, response: error.array() })
    } else {
        const user_id = req.body.user_id;
        // console.log(user_id);

        const user = await Product.findById(user_id);
        if (!user) {
            return res.json({ status: false, response: "No user found" })
        }

        await Product.removeProduct(user_id, (err, product) => {
            if (err) {
                return res.json({ status: false, response: err })
            }
            if (product) {
                return res.json({ status: true, message: "product Deleted" })
            }
        })
    }
}

module.exports = { product, addProduct, updateProduct, deleteProduct };