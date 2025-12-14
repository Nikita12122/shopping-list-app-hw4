import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    getShoppingLists,
    createShoppingList,
    deleteShoppingList
} from "../services/api";

const CURRENT_USER_ID = "u1";

export default function ShoppingListsOverview() {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showArchived, setShowArchived] = useState(false);

    // ✅ LOAD LISTS FROM BACKEND ONLY
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const res = await getShoppingLists();

                const listData = Array.isArray(res.data)
                    ? res.data
                    : res.data.data;  // <-- unwrap backend response if needed

                setLists(listData || []);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);



    const handleAddList = async () => {
        if (!newListName.trim()) return;

        try {
            const res = await createShoppingList(newListName.trim());

            setLists(prev => [
                ...prev,
                {
                    ...res.data,
                    members: [{ id: CURRENT_USER_ID, name: "Me" }],
                    items: []
                }
            ]);

            setNewListName("");
            setShowAddModal(false);
        } catch (e) {
            alert(e.message);
        }
    };





    // ✅ DELETE LIST IN BACKEND
    const handleDelete = async (id) => {
        try {
            await deleteShoppingList(id);

            // ✅ Proper array filtering
            setLists(prev => prev.filter(l => l._id !== id));

            setConfirmDeleteId(null);
        } catch (e) {
            alert(e.message);
        }
    };


    const handleArchive = async (id) => {
        const list = lists.find(l => l._id === id);
        if (!list) return;

        try {
            await fetch("http://localhost:3000/shoppingList/archive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": CURRENT_USER_ID,
                    "x-profile": "admin"
                },
                body: JSON.stringify({
                    id,
                    isArchived: !list.isArchived
                })
            });

            // ✅ Update UI after backend confirms
            setLists(prev =>
                prev.map(l =>
                    l._id === id ? { ...l, isArchived: !l.isArchived } : l
                )
            );

        } catch (e) {
            alert("Archiving failed");
        }
    };



    const visibleLists = lists.filter(list =>
        (list.ownerId === CURRENT_USER_ID ||
            list.memberIds?.includes(CURRENT_USER_ID))
        &&
        (!list.isArchived || showArchived)
    );

    if (loading) {
        return <div style={{ color: "white", padding: "2rem" }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: "white", padding: "2rem" }}>{error}</div>;
    }

    return (
        <div
            style={{
                padding: "2rem",
                color: "white",
                background: "#0b1220",
                minHeight: "100vh",
                fontFamily: "Arial, sans-serif"
            }}
        >
            <h1 style={{ marginBottom: "1rem" }}>My Shopping Lists</h1>

            {/* Toolbar */}
            <div
                style={{
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                }}
            >
                <button
                    style={{
                        padding: "0.6rem 1rem",
                        background: "#2563eb",
                        color: "white",
                    }}
                    onClick={() => setShowAddModal(true)}
                >
                    + New List
                </button>

                <label style={{ color: "#cbd5e1" }}>
                    <input
                        type="checkbox"
                        checked={showArchived}
                        onChange={(e) => setShowArchived(e.target.checked)}
                        style={{ marginRight: "0.4rem" }}
                    />
                    Show archived
                </label>
            </div>

            {/* LIST CARDS */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {visibleLists.map(list => {
                    const isOwner = list.ownerId === CURRENT_USER_ID;

                    return (
                        <div
                            key={list._id}
                            style={{
                                background: "#111a2c",
                                border: "1px solid #1f2a44",
                                padding: "1rem",
                                borderRadius: "12px",
                                width: "230px",
                                position: "relative",
                                textAlign: "center"
                            }}
                        >

                            <Link
                                to={`/list/${list._id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "white"
                                }}
                            >
                                <h3 style={{ marginTop: 0 }}>{list.name}</h3>
                            </Link>

                            <p style={{ color: "#94a3b8", margin: "0.3rem 0 1rem" }}>
                                {(list.memberIds || []).length} members
                            </p>

                            {isOwner && (
                                <button
                                    onClick={() => handleArchive(list._id)}
                                    style={{
                                        background: list.isArchived ? "#16a34a" : "#f59e0b",
                                        color: "white",
                                        padding: "0.4rem 1rem",
                                    }}
                                >
                                    {list.isArchived ? "Restore" : "Archive"}
                                </button>
                            )}

                            {isOwner && (
                                <button
                                    onClick={() => setConfirmDeleteId(list._id)}
                                    style={{
                                        position: "absolute",
                                        top: "6px",
                                        right: "8px",
                                        background: "transparent",
                                        border: "none",
                                        color: "#ef4444",
                                        cursor: "pointer",
                                        fontSize: "1.2rem"
                                    }}
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    );
                })}

                {visibleLists.length === 0 && (
                    <p style={{ color: "#94a3b8" }}>No lists found.</p>
                )}
            </div>

            {/* Add modal */}
            {showAddModal && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background: "#111a2c",
                            border: "1px solid #1f2a44",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "300px",
                            color: "white"
                        }}
                    >
                        <h2 style={{ marginTop: 0 }}>Create List</h2>

                        <input
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            placeholder="List name..."
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                borderRadius: "6px",
                                border: "1px solid #334155",
                                background: "#0d1730",
                                color: "white",
                                marginBottom: "1rem"
                            }}
                        />

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                onClick={() => setShowAddModal(false)}
                                style={{
                                    background: "#475569",
                                    color: "white",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddList}
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    padding: "0.4rem 0.8rem",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
            {confirmDeleteId && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background: "#111a2c",
                            padding: "20px",
                            borderRadius: "8px",
                            width: "280px",
                            color: "white",
                            border: "1px solid #1f2a44"
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
                        <p>Are you sure?</p>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                                marginTop: "15px"
                            }}
                        >
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                style={{
                                    background: "#475569",
                                    border: "none",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                style={{
                                    background: "#ef4444",
                                    border: "none",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
