const mongoose = require("mongoose");

const Schema = new mongoose.Schema
    ({
        title: {
            type: String,
            required: true,
            unique: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],


        active: {
            type: Boolean,
            default: true,
        }

    });

const categoryModel = mongoose.model("category", Schema);

module.exports = categoryModel;
