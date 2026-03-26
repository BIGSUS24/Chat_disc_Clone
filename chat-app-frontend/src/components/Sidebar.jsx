import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    // 1. Grab our Global Storage variables
    const { user, setUser } = useContext(AuthContext);
    const { onlineUsers } = useContext(SocketContext);
    const navigate = useNavigate();

    // 2. Set up local memory for our groups and search box
    const [groups, setGroups] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // 3. Ask the server for our 1-on-1 groups the second this loads
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // Hitting the Group route we made in backend
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

    // 4. Searching logic
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            // Hitting the Search route we made in backend
            const res = await axios.get(`http://localhost:5000/api/v1/auth/search?username=${search}`);
            if (res.data.success) {
                setSearchResults(res.data.data);
            }
        } catch (error) {
            console.error("Search failed", error);
        }
    };

    // 5. Logout logic
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/api/v1/auth/logout");
            setUser(null); // Wipe the cloud storage!
            navigate("/login"); // Kick them back to Login screen
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div style={{ width: "300px", borderRight: "1px solid #333", padding: "20px" }}>
            <h3>Welcome, {user?.username}</h3>
            <button onClick={handleLogout}>Logout</button>
            <hr style={{ margin: "20px 0" }}/>

            {/* Search Section */}
            <h4>Find Users</h4>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Search username..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                />
                <button type="submit">Search</button>
            </form>
            
            <ul style={{ listStyle: "none", padding: 0 }}>
                {searchResults.map((u) => (
                    <li key={u._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        {u.username} {onlineUsers.includes(u._id) ? "🟢" : "⚫"}
                        <button>Message</button>
                    </li>
                ))}
            </ul>
            
            <hr style={{ margin: "20px 0" }}/>

            {/* My Chats Section */}
            <h4>My Chats</h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {groups.map((g) => (
                    <li key={g._id} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #222" }}>
                        {g.name}
                    </li>
                ))}
                {groups.length === 0 && <p style={{ fontSize: "12px", color: "gray" }}>No chats active yet!</p>}
            </ul>
        </div>
    );
};

export default Sidebar;
