// __tests__/item.controller.test.js
const itemController = require("../controllers/item");

// Mock mongoose models
jest.mock("../models/Item", () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

jest.mock("../models/ShoppingList", () => ({
    findById: jest.fn()
}));

const Item = require("../models/Item");
const ShoppingList = require("../models/ShoppingList");

// Helpers
function mockRes() {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    return res;
}

function mockReq({ body = {}, query = {}, headers = {} } = {}) {
    return {
        body,
        query,
        header: (name) => headers[name.toLowerCase()] ?? headers[name]
    };
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("item controller unit tests", () => {
    // ---------------- CREATE ----------------
    test("create - happy day: creates item", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { shoppingListId: "list1", text: "Milk" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        ShoppingList.findById.mockResolvedValue({ _id: "list1" });
        Item.create.mockResolvedValue({
            _id: "item1",
            shoppingListId: "list1",
            text: "Milk",
            name: "Milk",
            isResolved: false
        });

        await itemController.create(req, res);

        expect(ShoppingList.findById).toHaveBeenCalledWith("list1");
        expect(Item.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalled();
    });

    test("create - alternative: missing text -> 400", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { shoppingListId: "list1" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        await itemController.create(req, res);

        expect(Item.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });

    test("create - alternative: list not found -> 404", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { shoppingListId: "badId", text: "Milk" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        ShoppingList.findById.mockResolvedValue(null);

        await itemController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("create - alternative: blocked profile -> 403", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { shoppingListId: "list1", text: "Milk" },
            headers: { "x-user-id": "u1", "x-profile": "anonymous" }
        });

        await itemController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    // ---------------- LIST ----------------
    test("list - happy day: returns items", async () => {
        const res = mockRes();
        const req = mockReq({ query: { shoppingListId: "list1" } });

        Item.find.mockResolvedValue([
            { _id: "1", shoppingListId: "list1", text: "Milk", isResolved: false }
        ]);

        await itemController.list(req, res);

        expect(Item.find).toHaveBeenCalledWith({ shoppingListId: "list1" });
        expect(res.json).toHaveBeenCalled();
    });

    test("list - alternative: missing shoppingListId -> 400", async () => {
        const res = mockRes();
        const req = mockReq({ query: {} });

        await itemController.list(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    // ---------------- UPDATE ----------------
    test("update - happy day: resolves item", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "item1", isResolved: true }
        });

        const item = { isResolved: false, save: jest.fn() };
        Item.findById.mockResolvedValue(item);

        await itemController.update(req, res);

        expect(item.isResolved).toBe(true);
        expect(item.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalled();
    });

    test("update - alternative: item not found -> 404", async () => {
        const res = mockRes();
        const req = mockReq({ body: { id: "badId" } });

        Item.findById.mockResolvedValue(null);

        await itemController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    // ---------------- DELETE ----------------
    test("delete - happy day: deletes item", async () => {
        const res = mockRes();
        const req = mockReq({ body: { id: "item1" } });

        Item.findByIdAndDelete.mockResolvedValue({ _id: "item1" });

        await itemController.delete(req, res);

        expect(Item.findByIdAndDelete).toHaveBeenCalledWith("item1");
        expect(res.json).toHaveBeenCalled();
    });

    test("delete - alternative: item not found -> 404", async () => {
        const res = mockRes();
        const req = mockReq({ body: { id: "badId" } });

        Item.findByIdAndDelete.mockResolvedValue(null);

        await itemController.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });
});
