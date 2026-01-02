import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getItems,
    updateItem,
    createItem,
    deleteShoppingList,
    getShoppingLists
} from "../services/api";

import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useTranslation } from "react-i18next";

const CURRENT_USER_ID = "u1";

export default function ShoppingListDetailPage() {
    const { t } = useTranslation();

    const { id } = useParams();

    const navigate = useNavigate();

    const [list, setList] = useState(null);
    const [error, setError] = useState(null);

    const [newItemText, setNewItemText] = useState("");
    const [newMemberName, setNewMemberName] = useState("");

    const [filter, setFilter] = useState("all");

    const [isRenaming, setIsRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState("");

    const [confirmAction, setConfirmAction] = useState(null);





    const ConfirmPopup = ({ open, onCancel, onConfirm }) => {
        if (!open) return null;
        if (!id) {
            return <h2 style={{ color: "red" }}>Invalid list ID</h2>;
        }
        return (
            <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    background: "#111a2c",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "280px",
                    color: "white",
                    border: "1px solid #1f2a44"
                }}>
                    <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
                    <p>Are you sure?</p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                        <button onClick={onCancel} style={{
                            background: "#475569",
                            border: "none",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}>
                            Cancel
                        </button>

                        <button onClick={onConfirm} style={{
                            background: "#ef4444",
                            border: "none",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}>
                            {t("delete")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ✅ LOAD LIST + ITEMS FROM BACKEND
    useEffect(() => {
        async function load() {
            try {
                setError(null);
                setList(null);

                // ✅ Load items
                const itemsRes = await getItems(id);

                // ✅ Load list from backend (IMPORTANT)
                const res = await fetch(`http://localhost:3000/shoppingList/get?id=${id}`);
                const listRes = await res.json();

                const backendList = listRes.data;

                // ✅ Convert memberIds → members with display names
                const members = backendList.memberIds.map(uid => ({
                    id: uid,
                    name: uid === "u1" ? "Me" : uid   // fallback name
                }));

                setList({
                    ...backendList,
                    members,
                    items: itemsRes.data

                });
            } catch (e) {
                setError(e.message);
            }
        }

        load();
    }, [id]);


    if (error) {
        return (
            <div style={{ color: "white", padding: "2rem" }}>
                <h1>{error}</h1>
                <button
                    onClick={() => navigate("/")}
                    style={{ background: "#2563eb", color: "white", padding: "0.5rem 1rem" }}
                >
                    ← {t("back")}
                </button>
            </div>
        );
    }

    if (!list) {
        return (
            <div style={{ color: "white", padding: "2rem" }}>
                <p>Loading...</p>
            </div>
        );
    }
    if (!list) {
        return (
            <div style={{ padding: "2rem" }}>
                <p>Loading...</p>
            </div>
        );
    }

    const resolvedCount = list.items.filter(i => i.isResolved).length;
    const unresolvedCount = list.items.length - resolvedCount;

    const pieData = [
        { name: t("resolved"), value: resolvedCount },
        { name: t("unresolved"), value: unresolvedCount }
    ];

    const PIE_COLORS = ["#22c55e", "#ef4444"];

    const isOwner = list.ownerId === CURRENT_USER_ID;
    const isMember = list.members.some((m) => m.id === CURRENT_USER_ID);

    // ✅ TOGGLE RESOLVE
    const toggleResolved = async (itemId) => {
        try {
            const item = list.items.find(i => i.id === itemId);

            const res = await updateItem(itemId, {
                isResolved: !item.isResolved
            });

            const updatedItems = list.items.map(i =>
                i.id === itemId
                    ? { ...res.data, text: res.data.name }
                    : i
            );

            setList({ ...list, items: updatedItems });
        } catch (e) {
            alert(e.message);
        }
    };

    // ✅ ADD ITEM
    const addItem = async (text) => {
        if (!isMember) return;

        try {
            const res = await createItem(list._id, text);

            setList({
                ...list,
                items: [...list.items, { ...res.data, text: res.data.name }]
            });
        } catch (e) {
            alert(e.message);
        }
    };

    // ✅ DELETE ITEM (UI ONLY — backend does not support delete yet)
    const deleteItem = async (itemId) => {
        try {
            await fetch("http://localhost:3000/item/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: itemId })
            });

            setList({
                ...list,
                items: list.items.filter(i => i.id !== itemId)
            });

        } catch (e) {
            alert("Delete failed");
        }
    };

// ✅ BACKEND LIST UPDATE (RESTORES updateList WITHOUT localStorage)
    const updateList = async (updated) => {
        try {
            // ✅ FIX: Send Mongo _id instead of id
            await fetch("http://localhost:3000/shoppingList/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": CURRENT_USER_ID,
                    "x-profile": "admin"
                },
                body: JSON.stringify({
                    id: updated._id,   // ✅ THIS is the real Mongo ID
                    name: updated.name
                })
            });

            // ✅ Update frontend UI
            setList(updated);

        } catch (e) {
            alert("Rename failed: " + e.message);
        }
    };


// ✅ MEMBER ACTIONS (UI ONLY)
    const addMember = async () => {
        if (!isOwner) return;

        const trimmed = newMemberName.trim();
        if (!trimmed) return;

        // ✅ FIX: stable ID based on name (NOT Date.now)
        const userId = trimmed.toLowerCase().replace(/\s+/g, "_");

        try {
            await fetch("http://localhost:3000/shoppingList/addMember", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "admin1",
                    "x-profile": "admin"
                },
                body: JSON.stringify({
                    id: list._id,
                    userId


            })
            });

            // ✅ Update UI correctly WITH NAME
            setList({
                ...list,
                members: [...list.members, { id: userId, name: trimmed }]
            });

            setNewMemberName("");

        } catch (e) {
            alert("Failed to add member");
        }
    };


    const removeMember = async (memberId) => {
        if (!isOwner) return;

        try {
            await fetch("http://localhost:3000/shoppingList/removeMember", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "admin1",
                    "x-profile": "admin"
                },
                body: JSON.stringify({
                    id: list._id,
                    userId: memberId


            })
            });

            setList({
                ...list,
                members: list.members.filter(m => m.id !== memberId)
            });

        } catch (e) {
            alert("Failed to remove member");
        }
    };


    const leaveList = async () => {
        try {
            await fetch("http://localhost:3000/shoppingList/removeMember", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": "admin1",
                    "x-profile": "admin"
                },
                body: JSON.stringify({
                    id: list._id,
                    userId: CURRENT_USER_ID
                })

            });

            navigate("/"); // ✅ instantly leave view
        } catch (e) {
            alert("Failed to leave list");
        }
    };


    // ✅ DELETE LIST (BACKEND)
    const deleteList = async () => {
        await deleteShoppingList(list._id);

        navigate("/");
    };

    const filteredItems = list.items.filter((item) => {
        if (filter === "all") return true;
        if (filter === "resolved") return item.isResolved;
        if (filter === "unresolved") return !item.isResolved;
        return true;
    });

    return (
        <div style={{padding: "2rem"}}>

            <button
                onClick={() => navigate("/")}
                style={{background: "#475569", color: "white", padding: "0.4rem 0.8rem"}}
            >
                ← {t("back")}
            </button>

            <h1>{list.name} </h1>
            {/* Rename */}
            {isOwner && (
                <div style={{margin: "1.5rem 0"}}>
                    {!isRenaming && (
                        <button
                            onClick={() => {
                                setRenameValue(list.name);
                                setIsRenaming(true);
                            }}
                            style={{
                                background: "#2563eb",
                                padding: "0.4rem 0.8rem",
                                color: "white"
                            }}
                        >
                            {t("renameList")}
                        </button>
                    )}

                    {isRenaming && (
                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                            <input
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                style={{
                                    background: "#2d2d3a",
                                    color: "white",
                                    padding: "0.4rem 0.8rem"
                                }}
                            />

                            <button
                                onClick={() => {
                                    if (renameValue.trim()) {
                                        updateList({...list, name: renameValue.trim()});
                                    }
                                    setIsRenaming(false);
                                }}
                                style={{
                                    background: "#16a34a",
                                    padding: "0.4rem 0.8rem",
                                    color: "white"
                                }}
                            >
                                Save
                            </button>

                            <button
                                onClick={() => setIsRenaming(false)}
                                style={{
                                    background: "#ef4444",
                                    padding: "0.4rem 0.8rem",
                                    color: "white"
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}
            <p>
                <strong>{t("ownerLabel")}:</strong>{" "}
                {isOwner ? t("youLabel") : list.members.find((m) => m.id === list.ownerId)?.name || "Friend"}
            </p>

            {/* Members */}
            <h3>{t("members")}</h3>
            <ul style={{listStyle: "none", padding: 0}}>
                {list.members.map((m) => (
                    <li
                        key={m.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "8px",
                            maxWidth: "300px"
                        }}
                    >
                        <span>
                            {m.name}
                            {m.id === CURRENT_USER_ID && ` (${t("youLabel")})`}
                            {m.id === list.ownerId && ` (${t("ownerLabel")})`}
                        </span>

                        {isOwner && m.id !== list.ownerId && (
                            <button
                                onClick={() =>
                                    setConfirmAction({type: "member", targetId: m.id})
                                }
                                style={{
                                    background: "#e55555",
                                    padding: "0.4rem 0.8rem",
                                    color: "white"
                                }}
                            >
                                {t("remove")}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {isOwner && (
                <div style={{marginBottom: "1rem"}}>
                    <input
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="New member..."
                        style={{
                            background: "#2d2d3a",
                            color: "white",
                            padding: "0.4rem",
                            marginRight: "0.5rem"
                        }}
                    />
                    <button
                        onClick={addMember}
                        style={{background: "#2563eb", color: "white", padding: "0.4rem 0.8rem"}}
                    >
                       {t("add")}

                    </button>
                </div>
            )}

            {!isOwner && isMember && (
                <button
                    onClick={leaveList}
                    style={{
                        background: "#f59e0b",
                        padding: "0.4rem 0.8rem",
                        marginBottom: "1rem"
                    }}
                >
                    {t("leaveList")}
                </button>
            )}

            <h2>{t("statistics")}</h2>

            <div style={{width: "100%", height: 260, marginBottom: "1.5rem"}}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={90}
                            label
                        >
                            {pieData.map((_, index) => (
                                <Cell key={index} fill={PIE_COLORS[index]}/>
                            ))}
                        </Pie>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>


            {/* ITEMS */}
            <h2>{t("items")}</h2>


            <div style={{display: "flex", gap: "0.5rem", marginBottom: "1rem"}}>
                <button
                    onClick={() => setFilter("all")}
                    style={{
                        background: filter === "all" ? "#2563eb" : "#475569",
                        padding: "0.4rem 0.8rem",
                        color: "white"
                    }}
                >
                    {t("all")}
                </button>

                <button
                    onClick={() => setFilter("unresolved")}
                    style={{
                        background: filter === "unresolved" ? "#2563eb" : "#475569",
                        padding: "0.4rem 0.8rem",
                        color: "white"
                    }}
                >
                    {t("unresolved")}
                </button>

                <button
                    onClick={() => setFilter("resolved")}
                    style={{
                        background: filter === "resolved" ? "#2563eb" : "#475569",
                        padding: "0.4rem 0.8rem",
                        color: "white"
                    }}
                >
                    {t("resolved")}
                </button>
            </div>

            <ul style={{listStyle: "none", padding: 0}}>
                {filteredItems.map((item) => (
                    <li
                        key={item.id}
                        style={{
                            background: "#2d2d3a",
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            borderRadius: "4px",
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        <span
                            style={{
                                textDecoration: item.isResolved ? "line-through" : "none"
                            }}
                        >
                            {item.text || item.name}

                        </span>

                        {isMember && (
                            <div style={{display: "flex", gap: "0.5rem"}}>
                                <button
                                    onClick={() => toggleResolved(item.id)}
                                    style={{
                                        background: item.isResolved ? "#38bdf8" : "#22c55e",
                                        color: "white",
                                        padding: "0.3rem 0.6rem"
                                    }}
                                >
                                    {item.isResolved ? t("undo") : t("resolve")}
                                </button>

                                <button
                                    onClick={() =>
                                        setConfirmAction({type: "item", targetId: item.id})
                                    }
                                    style={{
                                        background: "#ef4444",
                                        color: "white",
                                        padding: "0.3rem 0.6rem"
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Add item (only members) */}
            {isMember && (
                <div style={{marginTop: "1rem"}}>
                    <input
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Add item..."
                        style={{
                            background: "#2d2d3a",
                            color: "white",
                            padding: "0.4rem",
                            marginRight: "0.5rem"
                        }}
                    />
                    <button
                        onClick={() => {
                            if (newItemText.trim()) {
                                addItem(newItemText);
                                setNewItemText("");
                            }
                        }}
                        style={{
                            background: "#2563eb",
                            color: "white",
                            padding: "0.4rem 0.8rem"
                        }}
                    >
                        {t("add")}
                    </button>
                </div>
            )}

            {isOwner && (
                <button
                    onClick={() => setConfirmAction({type: "list"})}
                    style={{
                        background: "#d14b4b",
                        padding: "0.4rem 0.8rem",
                        color: "white",
                        marginTop: "2rem"
                    }}
                >
                    {t("deleteList")}

                </button>
            )}

            <ConfirmPopup
                open={!!confirmAction}
                onCancel={() => setConfirmAction(null)}
                onConfirm={() => {
                    if (confirmAction.type === "member") {
                        removeMember(confirmAction.targetId);
                    } else if (confirmAction.type === "item") {
                        deleteItem(confirmAction.targetId);
                    } else if (confirmAction.type === "list") {
                        deleteList();
                    }
                    setConfirmAction(null);
                }}
            />
        </div>
    );
}
