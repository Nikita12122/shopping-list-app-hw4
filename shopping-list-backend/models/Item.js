const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    shoppingListId: String,
    name: String,
    text: String,
    isResolved: Boolean,
    createdBy: String,
    createdAt: String
});

module.exports = mongoose.model("Item", itemSchema);
