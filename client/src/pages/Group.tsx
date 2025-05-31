import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export default function Group() {
    const { groupCode } = useParams();
    const [searchParams] = useSearchParams();
    const username = searchParams.get('username');

    return (
        <div className="max-w-xl mx-auto p-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Group: {groupCode}</h1>
            <p>Welcome, {username}!</p>
            <p>Challenge tracking and leaderboard coming soon...</p>
        </div>
    );
}