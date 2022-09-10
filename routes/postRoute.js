const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models(Schemas)/userModel");
const productModel = require("../models(Schemas)/postModel");
const categoryModel = require("../models(Schemas)/categoryModel");
const multer = require("multer");
const { ConnectingAirportsOutlined } = require("@mui/icons-material");
const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

// ! Add a new prooduct  ~~~~ "/post/newpost"
router.post("/newpost", upload.single('img'), async (req, res) => {
    console.log(req.body)
    console.log("running");
    const {
        title,
        description,
        price,
        category,
        seller,
        interestedBuyers,
        buyer,
    } = await req.body;
    if (!title || !description || !price || !category || !seller) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    const uploadFile = req.file.path;
    // console.log(uploadFile);
    let imgUrl = process.env.BASE_URL + "uploads/" + req.file.filename;
    const newProduct = new productModel({
        title: title,
        description: description,
        price: price,
        category: category,
        seller: seller,
        createdAt: Date.now(),
        deletedAt: null,
        imgUrl: imgUrl,
    });

    await newProduct.save(async (err, product) => {
        if (err) {
            console.log(err);
        } else {
            console.log(product);
            await userModel.findByIdAndUpdate(seller, {
                $push: { adds: newProduct._id },
            });
            await categoryModel.findByIdAndUpdate(category, {
                $push: { products: newProduct._id },
            });
        }
    });
    res.send("post");
});
// !Get all products ~~~~~~"/post/allproducts"
router.get("/allproducts", async (req, res) => {
    const categories = await productModel.find();
    res.send(categories);
});
//! set a product to inactive to true ~~~~~ '/post/id(of the product)'
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const category = await productModel.findById(id + "");
    console.log(category);
    category.active = !category.active;
    await category.save((err, category) => {
        if (err) {
            console.log(err);
        } else {
            console.log(category);
        }
    });

    res.send(category);
});
// !Delete a product ~~~" /post/id(of the product)"
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // delete from productModel
    let product = await productModel.findByIdAndDelete(id);
    let seller = await userModel.findByIdAndUpdate(product.seller, {
        $pull: { adds: product._id },
    });
    let category = await categoryModel.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
    });
    console.log(product_id);
    console.log(seller);
    console.log(category);

    res.send("deleted");
});
// !Interested in a post "/post/interesterd/id(of the user)"
router.post("/interested/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const product = await productModel.findById(id + "");
    console.log(product);
    product.interestedBuyers.push(req.body.buyer);
    await product.save((err, product) => {
        if (err) {
            console.log(err);
        } else {
            console.log(product);
        }
    });
    res.send({ msg: 'interest added' });
});
// !Add a buyer "/post/buyer/:id"
router.post("/buyer/:id"
);

module.exports = router;
