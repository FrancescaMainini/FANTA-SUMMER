const API_URL = process.env.REACT_APP_API_URL;

const joinGroup = async (username: string, inviteCode: string) => {
    const res = await fetch(`${API_URL}/group/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, inviteCode }),
    });
    const data = await res.json();
    return data;
};