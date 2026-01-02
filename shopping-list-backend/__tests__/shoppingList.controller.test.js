// __tests__/shoppingList.controller.test.js
const shoppingListController = require("../controllers/shoppingList");

// Mock the mongoose model used inside controller
jest.mock("../models/ShoppingList", () => ({
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

const ShoppingList = require("../models/ShoppingList");

// Helpers to build mock req/res
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
        header: (name) => headers[name.toLowerCase()] ?? headers[name] ?? undefined
    };
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe("shoppingList controller unit tests", () => {
    // ---------------- LIST ----------------
    test("list - happy day: returns list of shopping lists", async () => {
        const res = mockRes();
        const req = mockReq();
        const fakeLists = [{ _id: "1", name: "A" }, { _id: "2", name: "B" }];

        ShoppingList.find.mockResolvedValue(fakeLists);

        await shoppingListController.list(req, res);

        expect(ShoppingList.find).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ data: fakeLists, errorMap: [] });
    });

    // ---------------- GET ----------------
    test("get - happy day: returns one list", async () => {
        const res = mockRes();
        const req = mockReq({ query: { id: "abc123" } });
        const fakeList = { _id: "abc123", name: "Test list" };

        ShoppingList.findById.mockResolvedValue(fakeList);

        await shoppingListController.get(req, res);

        expect(ShoppingList.findById).toHaveBeenCalledWith("abc123");
        expect(res.json).toHaveBeenCalledWith({ data: fakeList, errorMap: [] });
    });

    test("get - alternative: missing id -> 400", async () => {
        const res = mockRes();
        const req = mockReq({ query: {} });

        await shoppingListController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        // Your controller returns validation errors or "Missing or invalid shopping list ID"
        expect(res.json).toHaveBeenCalled();
    });

    test("get - alternative: list not found -> 404", async () => {
        const res = mockRes();
        const req = mockReq({ query: { id: "doesNotExist" } });

        ShoppingList.findById.mockResolvedValue(null);

        await shoppingListController.get(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ errorMap: ["List not found"] });
    });

    // ---------------- CREATE ----------------
    test("create - happy day: user creates list -> 201", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { name: "New list" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        const created = { _id: "id1", name: "New list", ownerId: "u1", memberIds: ["u1"], isArchived: false };
        ShoppingList.create.mockResolvedValue(created);

        await shoppingListController.create(req, res);

        expect(ShoppingList.create).toHaveBeenCalledWith({
            name: "New list",
            ownerId: "u1",
            memberIds: ["u1"],
            isArchived: false
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ data: created, errorMap: [] });
    });

    test("create - alternative: missing name -> 400", async () => {
        const res = mockRes();
        const req = mockReq({
            body: {},
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        await shoppingListController.create(req, res);

        expect(ShoppingList.create).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    test("create - alternative: profile blocked -> 403", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { name: "X" },
            headers: { "x-user-id": "u1", "x-profile": "anonymous" }
        });

        await shoppingListController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalled();
    });

    // ---------------- UPDATE ----------------
    test("update - happy day: admin renames list", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "id1", name: "Renamed" },
            headers: { "x-user-id": "admin1", "x-profile": "admin" }
        });

        const updated = { _id: "id1", name: "Renamed" };
        ShoppingList.findByIdAndUpdate.mockResolvedValue(updated);

        await shoppingListController.update(req, res);

        expect(ShoppingList.findByIdAndUpdate).toHaveBeenCalledWith(
            "id1",
            { name: "Renamed" },
            { new: true }
        );
        expect(res.json).toHaveBeenCalledWith({ data: updated, errorMap: [] });
    });

    test("update - alternative: blocked profile -> 403", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "id1", name: "Renamed" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        await shoppingListController.update(req, res);

        expect(ShoppingList.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalled();
    });

    test("update - alternative: missing id or name -> 400", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "id1" }, // missing name
            headers: { "x-user-id": "admin1", "x-profile": "admin" }
        });

        await shoppingListController.update(req, res);

        expect(ShoppingList.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });

    // ---------------- DELETE ----------------
    test("delete - happy day: admin deletes list", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "id1" },
            headers: { "x-user-id": "admin1", "x-profile": "admin" }
        });

        const deleted = { _id: "id1", name: "ToDelete" };
        ShoppingList.findByIdAndDelete.mockResolvedValue(deleted);

        await shoppingListController.delete(req, res);

        expect(ShoppingList.findByIdAndDelete).toHaveBeenCalledWith("id1");
        expect(res.json).toHaveBeenCalledWith({ data: deleted, errorMap: [] });
    });

    test("delete - alternative: blocked profile -> 403", async () => {
        const res = mockRes();
        const req = mockReq({
            body: { id: "id1" },
            headers: { "x-user-id": "u1", "x-profile": "user" }
        });

        await shoppingListController.delete(req, res);

        expect(ShoppingList.findByIdAndDelete).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalled();
    });
});
