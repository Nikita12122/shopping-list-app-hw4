export const MOCK_SHOPPING_LISTS = [
    {
        id: "1",
        name: "Groceries",
        ownerId: "u1",
        memberIds: ["u1", "u2"],
        isArchived: false,
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z"
    },

    {
        id: "2",
        name: "Bob’s Secret List",
        ownerId: "u2",
        memberIds: [],
        isArchived: false,
        createdAt: "2025-12-08T18:00:00.000Z",
        updatedAt: "2025-12-08T18:00:00.000Z"
    }
];

export const MOCK_ITEMS = [
    {
        id: "i1",
        shoppingListId: "1",
        name: "Milk",
        isResolved: false,
        createdBy: "u2",
        createdAt: "2025-01-01T00:00:00Z"
    },
    {
        id: "i2",
        shoppingListId: "1",
        name: "Bread",
        isResolved: true,
        createdBy: "u1",
        createdAt: "2025-01-01T00:00:00Z"
    },

];
