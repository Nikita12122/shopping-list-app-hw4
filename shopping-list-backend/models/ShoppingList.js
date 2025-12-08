const mongoose = require("mongoose");

const shoppingListSchema = new mongoose.Schema({
    name: String,
    ownerId: String,
    memberIds: [String],
    isArchived: Boolean,
    createdAt: String,
    updatedAt: String
});

module.exports = mongoose.model("ShoppingList", shoppingListSchema);
