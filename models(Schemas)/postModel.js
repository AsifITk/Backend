const mongoose = require('mongoose');



const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true


    },
    description: {
        type: String,
        required: true

    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'



    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true


    },

    interestedBuyers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',

            default: []
        }
    ],

    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
    imgUrl: {

        type: String,
    }



});

const productModel = mongoose.model('Product', Schema);

module.exports = productModel;

