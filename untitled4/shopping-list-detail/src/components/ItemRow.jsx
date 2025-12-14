import React from "react";

export default function ItemRow({ item, canEdit, onToggleResolved, onDelete }) {
    return (
        <li className="list-row">
            <label className="row">
                <input
                    type="checkbox"
                    checked={item.isResolved}
                    onChange={(e) => onToggleResolved(e.target.checked)}
                    disabled={!canEdit}
                />

                <span className={item.isResolved ? "strike" : ""}>
                    {item.text || item.name}
                </span>
            </label>

            <button
                className="btn ghost"
                onClick={onDelete}
                disabled={!canEdit}
            >
                Delete
            </button>
        </li>
    );
}
