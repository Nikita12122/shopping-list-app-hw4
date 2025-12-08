const ShoppingList = require("../models/ShoppingList");

const {
    createDtoIn,
    listDtoIn,
    getDtoIn,
    updateDtoIn,
    deleteDtoIn,
    archiveDtoIn,
    addMemberDtoIn,
    removeMemberDtoIn
} = require("../validation/shoppingListDto");

// ------------------ HELPERS ------------------
function validate(dtoIn, rule) {
    const errors = [];

    for (const f of rule.required || []) {
        if (dtoIn[f] === undefined) errors.push(`Missing field: ${f}`);
    }

    for (const [f, t] of Object.entries(rule.types || {})) {
        if (dtoIn[f] !== undefined && typeof dtoIn[f] !== t) {
            errors.push(`Field ${f} must be ${t}`);
        }
    }

    return { isValid: errors.length === 0, errors };
}

function checkAuth(req) {
    return {
        userId: req.header("x-user-id") || null,
        profile: req.header("x-profile") || "anonymous"
    };
}

function authorize(auth, allowed) {
    if (!allowed.includes(auth.profile)) {
        return { isAuthorized: false, error: `Profile '${auth.profile}' blocked` };
    }
    return { isAuthorized: true };
}

// ------------------ CREATE ------------------
exports.create = async (req, res) => {
    try {
        const auth = checkAuth(req);
        const authRes = authorize(auth, ["user", "admin"]);
        if (!authRes.isAuthorized) {
            return res.status(403).json({ errorMap: [authRes.error] });
        }

        const val = validate(req.body, createDtoIn);
        if (!val.isValid) {
            return res.status(400).json({ errorMap: val.errors });
        }

        const newList = await ShoppingList.create({
            name: req.body.name,
            ownerId: auth.userId,
            memberIds: [auth.userId],
            isArchived: false
        });

        res.status(201).json({ data: newList, errorMap: [] });

    } catch (err) {
        res.status(500).json({ errorMap: ["Server error: " + err.message] });
    }
};

// ------------------ LIST ------------------
exports.list = async (req, res) => {
    const lists = await ShoppingList.find();
    res.json({ data: lists, errorMap: [] });
};

// ------------------ GET ------------------

exports.get = async (req, res) => {
    try {
        const val = validate(req.query, getDtoIn);
        if (!val.isValid)
            return res.status(400).json({ errorMap: val.errors });

        if (!req.query.id || req.query.id === "undefined") {
            return res.status(400).json({
                errorMap: ["Missing or invalid shopping list ID"]
            });
        }

        const list = await ShoppingList.findById(req.query.id);

        if (!list)
            return res.status(404).json({ errorMap: ["List not found"] });

        res.json({ data: list, errorMap: [] });

    } catch (err) {
        res.status(500).json({
            errorMap: ["Server error: " + err.message]
        });
    }
};


// ------------------ UPDATE ------------------
exports.update = async (req, res) => {
    const auth = checkAuth(req);
    const authRes = authorize(auth, ["admin"]);
    if (!authRes.isAuthorized)
        return res.status(403).json({ errorMap: [authRes.error] });

    const val = validate(req.body, updateDtoIn);
    if (!val.isValid)
        return res.status(400).json({ errorMap: val.errors });

    const updated = await ShoppingList.findByIdAndUpdate(
        req.body.id,
        { name: req.body.name },
        { new: true }
    );

    res.json({ data: updated, errorMap: [] });
};

// ------------------ DELETE ------------------
exports.delete = async (req, res) => {
    const auth = checkAuth(req);
    const authRes = authorize(auth, ["admin"]);
    if (!authRes.isAuthorized)
        return res.status(403).json({ errorMap: [authRes.error] });

    const deleted = await ShoppingList.findByIdAndDelete(req.body.id);

    res.json({ data: deleted, errorMap: [] });
};

// ------------------ ARCHIVE ------------------
exports.archive = async (req, res) => {
    const auth = checkAuth(req);
    const authRes = authorize(auth, ["admin"]);
    if (!authRes.isAuthorized)
        return res.status(403).json({ errorMap: [authRes.error] });

    const updated = await ShoppingList.findByIdAndUpdate(
        req.body.id,
        { isArchived: req.body.isArchived },
        { new: true }
    );

    res.json({ data: updated, errorMap: [] });
};

// ------------------ ADD MEMBER ------------------
exports.addMember = async (req, res) => {
    const updated = await ShoppingList.findByIdAndUpdate(
        req.body.id,
        { $addToSet: { memberIds: req.body.userId } },
        { new: true }
    );

    res.json({ data: updated, errorMap: [] });
};

// ------------------ REMOVE MEMBER ------------------
exports.removeMember = async (req, res) => {
    const updated = await ShoppingList.findByIdAndUpdate(
        req.body.id,
        { $pull: { memberIds: req.body.userId } },
        { new: true }
    );

    res.json({ data: updated, errorMap: [] });
};
