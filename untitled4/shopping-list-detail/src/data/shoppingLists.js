export const MOCK_LISTS = [
    {
        id: "1",
        name: "Groceries",
        ownerId: "u1",
        members: [
            { id: "u1", name: "Me" },
            { id: "u2", name: "Emma" },
        ],
        items: [
            { id: "i1", text: "Milk", isResolved: false, createdBy: "u2" },
            { id: "i2", text: "Bread", isResolved: true, createdBy: "u1" },
        ],
        isArchived: false,
    },

    //member here
    {
        id: "2",
        name: "Party Supplies",
        ownerId: "u2",
        members: [
            { id: "u1", name: "Me" },
            { id: "u2", name: "Emma" },
            { id: "u3", name: "Liam" },
        ],
        items: [
            { id: "i3", text: "Balloons", isResolved: false, createdBy: "u3" },
            { id: "i4", text: "Cake", isResolved: false, createdBy: "u2" },
        ],
        isArchived: false,
    },

    // member here
    {
        id: "3",
        name: "Work Groceries",
        ownerId: "u3",
        members: [
            { id: "u1", name: "Me" },
            { id: "u3", name: "Liam" },
        ],
        items: [
            { id: "i5", text: "Coffee", isResolved: true, createdBy: "u1" },
            { id: "i6", text: "Snacks", isResolved: false, createdBy: "u3" },
        ],
        isArchived: false,
    },


    {
        id: "4",
        name: "BBQ Shopping List",
        ownerId: "u2",
        members: [
            { id: "u1", name: "Me" },
            { id: "u2", name: "Emma" },
        ],
        items: [
            { id: "i7", text: "Steaks", isResolved: false, createdBy: "u2" },
            { id: "i8", text: "BBQ Sauce", isResolved: false, createdBy: "u1" },
        ],
        isArchived: false,
    },


    {
        id: "5",
        name: "Office Supplies",
        ownerId: "u3",
        members: [
            { id: "u1", name: "Me" },
            { id: "u2", name: "Emma" },
            { id: "u3", name: "Liam" },
        ],
        items: [
            { id: "i9", text: "Paper", isResolved: true, createdBy: "u2" },
            { id: "i10", text: "Pens", isResolved: false, createdBy: "u1" },
        ],
        isArchived: false,
    },


    {
        id: "6",
        name: "School Project Materials",
        ownerId: "u3",
        members: [
            { id: "u1", name: "Me" },
            { id: "u3", name: "Liam" },
        ],
        items: [
            { id: "i11", text: "Colored Paper", isResolved: false, createdBy: "u3" },
            { id: "i12", text: "Glue", isResolved: false, createdBy: "u1" },
        ],
        isArchived: false,
    },
];
