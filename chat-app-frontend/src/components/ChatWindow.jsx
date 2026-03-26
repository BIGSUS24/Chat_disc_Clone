// src/components/ChatWindow.jsx
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";

const ChatWindow = ({ selectedGroup }) => {
    const { user } = useContext(AuthContext);
    const { socket } = useContext(SocketContext); // <-- Fixed (was grabbing SocketContext instead of socket)
    
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    // 1. Fetch history when chat is clicked
    useEffect(() => {
        if (!selectedGroup) return; // <-- Fixed (lowercase 's')

        const fetchMessages = async () => {
             try {
                 const res = await axios.get(`http://localhost:5000/api/v1/messages/${selectedGroup._id}`);
                 if (res.data.success) {
                     setMessages(res.data.data);
                 }
             } catch (error) {
                 console.error("Failed to fetch messages", error);
             }
        };
        fetchMessages(); // <-- Fixed (Moved outside the function definition so it actually runs once!)
    }, [selectedGroup]);

    // 2. Listen for Live Messages
    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (newMsg) => {
            if (selectedGroup && selectedGroup._id === newMsg.conversationId) { 
                 setMessages((prev) => [...prev, newMsg]);
            }
        });

        return () => socket.off("newMessage"); // <-- Fixed (Singular "newMessage")
    }, [socket, selectedGroup]);

    // 3. Send Message
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || !selectedGroup) return;

        try {
            const res = await axios.post(`http://localhost:5000/api/v1/messages/${selectedGroup._id}`, { text });
            
            if (res.data.success) {
                setMessages((prev) => [...prev, res.data.data]);
                setText(""); 
            }
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    // If no chat selected:
    if (!selectedGroup) return <div>Pick a chat to start messaging!</div>;

    // The raw structure:
    return (
        <div>
            {/* Header */}
            <h2>Chat: {selectedGroup.name}</h2>
            
            {/* Message List */}
            <div>
                {messages.map((m) => (
                    <div key={m._id}>
                        <b>{m.senderId === user._id ? "Me" : "Them"}: </b>
                        <span>{m.text}</span>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSend}>
                <input 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatWindow;
