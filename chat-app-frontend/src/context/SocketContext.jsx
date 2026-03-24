import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import io from "socket.io-client";

// Create the context (Our Live Radio Station)
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // We need to know who is logged in so we can assign their Walkie-Talkie!
    const { user } = useContext(AuthContext);

    useEffect(() => {
        // If the user logs in, turn the radio ON
        if (user) {
            const newSocket = io("http://localhost:5000", {
                query: {
                    userId: user._id
                }
            });
            
            setSocket(newSocket);

            // Listen for the server shouting "Here is who is online!"
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            // Turn off the radio if they leave the page
            return () => newSocket.close();
        } else {
            // If they log out, immediately break the connection
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]); // Restart this whole process if the 'user' changes

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
