const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemName: {type: String, required: true},
    description: {type: String, required: true},
    locationFound: {type: String, required: true},
    dateFound: {type: Date, default: Date.now},
    claimed: {type: Boolean, default: false}
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;