import React, { useState } from "react";

function AddMemberForm({ onInvite, disabled }) {
    const [email, setEmail] = useState("");
    const submit = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        onInvite(email.trim());
        setEmail("");
    };
    return (
        <form className="row" onSubmit={submit}>
            <input
                className="input"
                placeholder="Invite by email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
            />
            <button className="btn" disabled={disabled}>Invite</button>
        </form>
    );
}

export default function MembersBar({
                                       members,
                                       ownerId,
                                       currentUserId,
                                       isOwner,
                                       onInviteMember,
                                       onRemoveMember,
                                   }) {
    return (
        <section className="members">
            <div className="row space">
                <h3>Members</h3>
                <span className="muted">{members.length} total</span>
            </div>

            <div className="chips">
                {members.map((m) => {
                    const isOwnerBadge = m.id === ownerId;
                    const isSelf = m.id === currentUserId;
                    const canRemove = isOwner ? (!isOwnerBadge) : isSelf; // owner can remove others; member can remove himself
                    return (
                        <div key={m.id} className="chip">
                            <span>{m.name}</span>
                            {isOwnerBadge && <span className="badge small">Owner</span>}
                            {canRemove && (
                                <button className="chip-btn" onClick={() => onRemoveMember(m.id)}>
                                    ✖
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="row">
                <AddMemberForm onInvite={onInviteMember} disabled={!isOwner} />
            </div>
        </section>
    );
}
