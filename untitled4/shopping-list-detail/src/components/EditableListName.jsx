import React, { useState } from "react";

export default function EditableListName({ name, isOwner, onRename }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(name);

    const save = () => {
        if (val.trim() && val !== name) onRename(val.trim());
        setEditing(false);
    };

    if (!isOwner) {
        return <h2 className="title">{name}</h2>;
    }

    return (
        <div className="editable">
            {editing ? (
                <>
                    <input
                        className="input"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && save()}
                        autoFocus
                    />
                    <button className="btn" onClick={save}>Save</button>
                    <button className="btn ghost" onClick={() => { setVal(name); setEditing(false); }}>
                        Cancel
                    </button>
                </>
            ) : (
                <>
                    <h2 className="title">{name}</h2>
                    <button className="btn ghost" onClick={() => setEditing(true)}> Edit</button>
                </>
            )}
        </div>
    );
}
