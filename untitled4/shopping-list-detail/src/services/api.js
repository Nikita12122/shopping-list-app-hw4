import { API_URL, USE_MOCK } from "./config";
import { MOCK_SHOPPING_LISTS, MOCK_ITEMS } from "../data/mockList";

// -------------------------------
// ✅ HELPER
// -------------------------------
async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.errorMap?.join(", ") || "Server error");
    }

    return data;
}

// -------------------------------
// ✅ SHOPPING LISTS
// -------------------------------

export async function getShoppingLists() {
    if (USE_MOCK) {
        return { data: MOCK_SHOPPING_LISTS };
    }

    return safeFetch(`${API_URL}/shoppingList/list`);
}

export async function createShoppingList(name) {
    if (USE_MOCK) {
        const newList = {
            id: Date.now().toString(),
            name,
            ownerId: "u1",
            memberIds: ["u1"],
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        MOCK_SHOPPING_LISTS.push(newList);
        return { data: newList };
    }

    return safeFetch(`${API_URL}/shoppingList/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": "u1",
            "x-profile": "user"
        },
        body: JSON.stringify({ name })
    });
}

export async function deleteShoppingList(id) {
    if (USE_MOCK) {
        const index = MOCK_SHOPPING_LISTS.findIndex(l => l.id === id);
        if (index !== -1) MOCK_SHOPPING_LISTS.splice(index, 1);
        return { data: id };
    }

    return safeFetch(`${API_URL}/shoppingList/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": "admin1",
            "x-profile": "admin"
        },
        body: JSON.stringify({ id })
    });
}

// -------------------------------
// ✅ ITEMS
// -------------------------------

export async function getItems(shoppingListId) {
    if (USE_MOCK) {
        return { data: MOCK_ITEMS.filter(i => i.shoppingListId === shoppingListId) };
    }

    const res = await safeFetch(`${API_URL}/item/list?shoppingListId=${shoppingListId}`);
    return { ...res, data: res.data.map(normalizeItem) };
}

export async function createItem(shoppingListId, text) {
    if (USE_MOCK) {
        const newItem = {
            id: Date.now().toString(),
            shoppingListId,
            name: text,
            text,                      // ✅ REQUIRED FOR UI
            isResolved: false,
            createdBy: "u1",
            createdAt: new Date().toISOString()
        };

        MOCK_ITEMS.push(newItem);
        return { data: newItem };
    }

    return safeFetch(`${API_URL}/item/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": "u1",
            "x-profile": "user"
        },
        body: JSON.stringify({
            shoppingListId,   // ✅ REQUIRED FIELD
            text
        })
    });
}


export async function updateItem(id, updates) {
    if (USE_MOCK) {
        const item = MOCK_ITEMS.find(i => i.id === id);
        if (item) Object.assign(item, updates);
        return { data: item };
    }

    const res = await safeFetch(`${API_URL}/item/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": "u1",
            "x-profile": "user"
        },
        body: JSON.stringify({ id, ...updates })
    });

    return { ...res, data: normalizeItem(res.data) };
}


function normalizeItem(i) {
    if (!i) return i;
    return { ...i, id: i.id || i._id };
}
