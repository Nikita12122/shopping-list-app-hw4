import React from "react";

export default function FilterToggle({ showResolved, onChange }) {
    return (
        <label className="row">
            <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => onChange(e.target.checked)}
            />
            &nbsp;Show resolved items
        </label>
    );
}
