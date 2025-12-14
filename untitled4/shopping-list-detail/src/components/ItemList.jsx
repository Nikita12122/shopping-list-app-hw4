import React from "react";
import ItemRow from "./ItemRow";

export default function ItemList({ items, canEdit, onToggleResolved, onDeleteItem }) {
    if (!items.length) {
        return <div className="muted">No items to show.</div>;
    }
    return (
        <ul className="list">
            {items.map((item) => (
                <ItemRow
                    key={item.id}
                    item={item}
                    canEdit={canEdit}
                    onToggleResolved={(resolved) => onToggleResolved(item.id, resolved)}
                    onDelete={() => onDeleteItem(item.id)}
                />
            ))}
        </ul>
    );
}
