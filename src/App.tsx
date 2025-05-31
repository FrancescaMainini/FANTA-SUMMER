import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

type JoinForm = {
    username: string;
    inviteCode: string;
};

type CreateForm = {
    groupName: string;
    username: string;
};

function App() {
    const [mode, setMode] = useState<"join" | "create">("join");
    const [joinForm, setJoinForm] = useState<JoinForm>({ username: "", inviteCode: "" });
    const [createForm, setCreateForm] = useState<CreateForm>({ groupName: "", username: "" });
    const [message, setMessage] = useState<string | null>(null);

    const handleJoin = async () => {
        if (!joinForm.username || !joinForm.inviteCode) {
            setMessage("Please fill username and invite code");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/group/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(joinForm),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Joined group: ${data.groupName} (ID: ${data.groupId})`);
            } else {
                setMessage(`Error: ${data.error || "Unknown error"}`);
            }
        } catch (e) {
            setMessage("Network error");
        }
    };

    const handleCreate = async () => {
        if (!createForm.groupName || !createForm.username) {
            setMessage("Please fill group name and username");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/group`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: createForm.groupName,
                    username: createForm.username,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Group created! Invite code: ${data.inviteCode}`);
            } else {
                setMessage(`Error: ${data.error || "Unknown error"}`);
            }
        } catch (e) {
            setMessage("Network error");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
            <h1>Summer Challenge Groups</h1>
            <div style={{ marginBottom: 20 }}>
                <button onClick={() => { setMode("join"); setMessage(null); }} disabled={mode === "join"}>
                    Join Group
                </button>
                <button onClick={() => { setMode("create"); setMessage(null); }} disabled={mode === "create"} style={{ marginLeft: 10 }}>
                    Create Group
                </button>
            </div>

            {mode === "join" && (
                <div>
                    <input
                        placeholder="Username"
                        value={joinForm.username}
                        onChange={(e) => setJoinForm({ ...joinForm, username: e.target.value })}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        placeholder="Invite Code"
                        value={joinForm.inviteCode}
                        onChange={(e) => setJoinForm({ ...joinForm, inviteCode: e.target.value.toUpperCase() })}
                        style={{ width: "100%", marginBottom: 10, padding: 8, textTransform: "uppercase" }}
                    />
                    <button onClick={handleJoin} style={{ width: "100%", padding: 10 }}>
                        Join Group
                    </button>
                </div>
            )}

            {mode === "create" && (
                <div>
                    <input
                        placeholder="Group Name"
                        value={createForm.groupName}
                        onChange={(e) => setCreateForm({ ...createForm, groupName: e.target.value })}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <input
                        placeholder="Your Username"
                        value={createForm.username}
                        onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                        style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    />
                    <button onClick={handleCreate} style={{ width: "100%", padding: 10 }}>
                        Create Group
                    </button>
                </div>
            )}

            {message && (
                <div style={{ marginTop: 20, padding: 10, backgroundColor: "#eee", borderRadius: 4 }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default App;