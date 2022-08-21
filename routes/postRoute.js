const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const productModel = require("../models/postModel");
const categoryModel = require("../models/categoryModel");
const router = express.Router();

router.post("/", async (req, res) => {
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
    const newProduct = new productModel({
        title: title,
        description: description,
        price: price,
        category: category,
        seller: seller,
        createdAt: Date.now(),
        deletedAt: null,
    });

    await newProduct.save(async (err, product) => {
        if (err) {
            console.log(err);
        } else {
            console.log(product);
            await userModel.findByIdAndUpdate(seller, { $push: { adds: newProduct._id } })
            await categoryModel.findByIdAndUpdate(category, { $push: { products: newProduct._id } })


        }
    });
    res.send("post");
});

router.get("/", async (req, res) => {
    const categories = await productModel.find();
    res.send(categories);
}
);

// set inactive to true

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
    }
    );

    res.send(category);
}
);
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // delete from productModel
    await productModel.findByIdAndDelete(id + "", (err, product) => {
        if (err) {
            console.log(err);
        } else {
            console.log(product);
            // remove from userModel
            userModel.findByIdAndUpdate(product.seller, { $pull: { adds: product._id } }, (err, user) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(user);
                }
            });
            categoryModel.findByIdAndUpdate(product.category, { $pull: { products: product._id } }, (err, category) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(category);
                }
            });
        }
    }
    );
    res.send("deleted");
}
);

router.put("/interested/:id", async (req, res) => {
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
    }
    );
    res.send("interest added");
}
);








module.exports = router;
