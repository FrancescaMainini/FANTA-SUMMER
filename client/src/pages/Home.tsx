import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [joinUsername, setJoinUsername] = useState('');
    const [joinGroupCode, setJoinGroupCode] = useState('');
    const [createGroupName, setCreateGroupName] = useState('');
    const [createUsername, setCreateUsername] = useState('');
    const navigate = useNavigate();

    function joinGroup() {
        if (joinUsername && joinGroupCode) {
            // Qui normalmente chiameresti API per verificare
            navigate(`/group/${joinGroupCode}?username=${joinUsername}`);
        } else {
            alert('Please enter username and group code');
        }
    }

    function createGroup() {
        if (createGroupName && createUsername) {
            // Codice gruppo generato casualmente (esempio)
            const newGroupCode = Math.random().toString(36).slice(2, 8).toUpperCase();
            // Qui chiameresti API per creare il gruppo e utente
            alert(`Group created! Share this code: ${newGroupCode}`);
            navigate(`/group/${newGroupCode}?username=${createUsername}`);
        } else {
            alert('Please enter group name and username');
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6 space-y-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome to Summer Challenge</h1>

            <section className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Join a Group</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={joinUsername}
                    onChange={e => setJoinUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Group Code"
                    value={joinGroupCode}
                    onChange={e => setJoinGroupCode(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button onClick={joinGroup} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Join Group
                </button>
            </section>

            <section className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Create a Group</h2>
                <input
                    type="text"
                    placeholder="Group Name"
                    value={createGroupName}
                    onChange={e => setCreateGroupName(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    placeholder="Your Username"
                    value={createUsername}
                    onChange={e => setCreateUsername(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                />
                <button onClick={createGroup} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Create Group
                </button>
            </section>
        </div>
    );
}