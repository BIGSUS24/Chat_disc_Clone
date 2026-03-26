import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

// 🚨 Notice we accept setSelectedGroup here now!
const Sidebar = ({ setSelectedGroup }) => {
    const { user, setUser } = useContext(AuthContext);
    const { onlineUsers } = useContext(SocketContext);
    const navigate = useNavigate();

    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // 1. Fetch our groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/groups");
                if (res.data.success) {
                    setGroups(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
            }
        };
        fetchGroups();
    }, []);

    // 2. Search for users
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/auth/search?username=${search}`);
            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    // 3. Start a brand new chat!
    const handleStartChat = async (targetUserId, targetUsername) => {
        try {
            // Hit your group controller to create a new conversation
            const res = await axios.post("http://localhost:5000/api/v1/groups", {
                name: `${user.username} & ${targetUsername}`,
                members: [targetUserId]
            });
            
            if (res.data.success) {
                const newGroup = res.data.data;
                setGroups((prev) => [...prev, newGroup]); // Add to sidebar
                setSelectedGroup(newGroup);               // Open the chat window instantly
                setSearchResults([]);                     // Clear the search results
                setSearch("");                            // Clear the search box
            }
        } catch (error) {
            console.error("Failed to start chat", error);
        }
    };

    // 4. Logout
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/v1/auth/logout");
            setUser(null); 
            navigate("/login"); 
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div>
            <h2>Welcome, {user?.username}</h2>
            <button onClick={handleLogout}>Logout</button>
            <hr />

            {/* --- Search Box --- */}
            <h3>Find Users</h3>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <button type="submit">Search</button>
            </form>
            
            {/* --- Search Results --- */}
            <ul>
                {searchResults.map((u) => (
                    <li key={u._id}>
                        {u.username} {onlineUsers.includes(u._id) ? "🟢" : "⚫"}
                        {/* 🚨 This button now actually starts a chat! */}
                        <button onClick={() => handleStartChat(u._id, u.username)}>
                            Message
                        </button>
                    </li>
                ))}
            </ul>
            <hr />

            {/* --- My Active Chats --- */}
            <h3>My Chats</h3>
            <ul>
                {groups.map((g) => (
                    // 🚨 Clicking a group name changes the active chat window!
                    <li key={g._id} onClick={() => setSelectedGroup(g)}>
                        <button>{g.name}</button>
                    </li>
                ))}
                {groups.length === 0 && <p>No chats active yet!</p>}
            </ul>
        </div>
    );
};

export default Sidebar;
