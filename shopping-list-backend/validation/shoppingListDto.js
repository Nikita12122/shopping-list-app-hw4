
exports.createDtoIn = {
    required: ["name"],
    types: {
        name: "string"
    }
};

exports.listDtoIn = {
    required: [],
    types: {}
};

exports.getDtoIn = {
    required: ["id"],
    types: {
        id: "string"
    }
};

exports.updateDtoIn = {
    required: ["id", "name"],
    types: {
        id: "string",
        name: "string"
    }
};

exports.deleteDtoIn = {
    required: ["id"],
    types: { id: "string" }
};

exports.archiveDtoIn = {
    required: ["id", "isArchived"],
    types: {
        id: "string",
        isArchived: "boolean"
    }
};

exports.addMemberDtoIn = {
    required: ["id", "userId"],
    types: {
        id: "string",
        userId: "string"
    }
};

exports.removeMemberDtoIn = {
    required: ["id", "userId"],
    types: {
        id: "string",
        userId: "string"
    }
};
