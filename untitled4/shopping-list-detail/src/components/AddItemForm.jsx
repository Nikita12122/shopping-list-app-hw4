import React, { useState } from "react";

export default function AddItemForm({ onAddItem }) {
    const [text, setText] = useState("");

    const submit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAddItem(text.trim());
        setText("");
    };

    return (
        <form className="row" onSubmit={submit}>
            <input
                className="input"
                placeholder="Add item…"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="btn">Add</button>
        </form>
    );
}
