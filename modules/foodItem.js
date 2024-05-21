const mongoose = require('mongoose');
const bcrypt = require('bcrypt');




const foodItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,


    },
    description: {
        type: String,

    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    expiryDate: {
        type: Date,
        required: true
    }
});
const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;