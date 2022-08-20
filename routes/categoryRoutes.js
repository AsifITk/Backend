const express = require("express");
const mongoose = require("mongoose");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/postModel");
const router = express.Router();

router.post("/", async (req, res) => {
    const { title, createdAt } = await req.body;
    if (!title) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    console.log(typeof req.body);
    const newCategory = new categoryModel(req.body);
    console.log(newCategory);
    await newCategory.save((err, category) => {
        if (err) {
            console.log(err);
        } else {
            console.log(category);
        }
    });
    res.send("post");

});


router.get("/", async (req, res) => {
    const categories = await categoryModel.find();
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







module.exports = router;