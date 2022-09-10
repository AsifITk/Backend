const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {

        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    adds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    createdAt: {
        type: Date,
        default: Date.now
    }


});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;