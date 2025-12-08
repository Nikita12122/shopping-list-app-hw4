
exports.createDtoIn = {
    required: ["shoppingListId", "text"],
    types: {
        shoppingListId: "string",
        text: "string"
    }
};



exports.updateDtoIn = {
    required: ["id"],
    types: {
        id: "string",
        text: "string",
        isResolved: "boolean"
    }
};


exports.listDtoIn = {
    required: ["shoppingListId"],
    types: { shoppingListId: "string" }
};
