const Item = require("../models/Item");
const ShoppingList = require("../models/ShoppingList");

const {
    createDtoIn,
    updateDtoIn,
    listDtoIn
} = require("../validation/itemDto");

// -------------------- HELPERS --------------------
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

// -------------------- ✅ CREATE ITEM --------------------
exports.create = async (req, res) => {
    try {
        const auth = checkAuth(req);
        const authRes = authorize(auth, ["user", "admin"]);
        if (!authRes.isAuthorized)
            return res.status(403).json({ errorMap: [authRes.error] });

        const validation = validate(req.body, createDtoIn);
        if (!validation.isValid)
            return res.status(400).json({ errorMap: validation.errors });

        const list = await ShoppingList.findById(req.body.shoppingListId);
        if (!list)
            return res.status(404).json({ errorMap: ["Shopping list not found"] });

        const newItem = await Item.create({
            shoppingListId: req.body.shoppingListId,
            name: req.body.text,
            text: req.body.text,
            isResolved: false,
            createdBy: auth.userId
        });

        res.status(201).json({
            data: {
                id: newItem._id.toString(),
                shoppingListId: newItem.shoppingListId,
                text: newItem.text,
                name: newItem.name,
                isResolved: newItem.isResolved,
                createdAt: newItem.createdAt
            },
            errorMap: []
        });

    } catch (err) {
        res.status(500).json({ errorMap: ["Server error: " + err.message] });
    }
};

// -------------------- ✅ UPDATE ITEM --------------------
exports.update = async (req, res) => {
    const validation = validate(req.body, updateDtoIn);
    if (!validation.isValid)
        return res.status(400).json({ errorMap: validation.errors });

    const item = await Item.findById(req.body.id);
    if (!item)
        return res.status(404).json({ errorMap: ["Item not found"] });

    if (req.body.text !== undefined) {
        item.text = req.body.text;
        item.name = req.body.text;
    }

    if (req.body.isResolved !== undefined)
        item.isResolved = req.body.isResolved;

    await item.save();
    res.json({ data: item, errorMap: [] });
};

// -------------------- ✅ LIST ITEMS --------------------
exports.list = async (req, res) => {
    const validation = validate(req.query, listDtoIn);
    if (!validation.isValid)
        return res.status(400).json({ errorMap: validation.errors });

    const items = await Item.find({
        shoppingListId: req.query.shoppingListId
    });

    const fixed = items.map(i => ({
        id: i._id.toString(),
        shoppingListId: i.shoppingListId,
        text: i.text || i.name,
        name: i.name,
        isResolved: i.isResolved,
        createdAt: i.createdAt
    }));

    res.json({ data: fixed, errorMap: [] });
};

// -------------------- ✅ DELETE ITEM --------------------
exports.delete = async (req, res) => {
    const deleted = await Item.findByIdAndDelete(req.body.id);

    if (!deleted)
        return res.status(404).json({ errorMap: ["Item not found"] });

    res.json({ data: deleted, errorMap: [] });
};
