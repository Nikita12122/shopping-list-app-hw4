import React from "react";
import ItemRow from "./ItemRow";

export default function ItemList({ items, canEdit, onToggleResolved, onDeleteItem }) {
    if (!items.length) {
        return <div className="muted">No items to show.</div>;
    }
    return (
        <ul className="list">
            {items.map((item) => {
                const itemId = item.id || item._id;
                return (
                    <ItemRow
                        key={itemId}
                        item={{ ...item, id: itemId }}
                        canEdit={canEdit}
                        onToggleResolved={(resolved) => onToggleResolved(itemId, resolved)}
                        onDelete={() => onDeleteItem(itemId)}
                    />
                );
            })}

        </ul>
    );
}
