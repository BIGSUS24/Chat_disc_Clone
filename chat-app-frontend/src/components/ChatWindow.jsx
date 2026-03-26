import { useContext, useState } from "react"
import axios from "axios"
import { AuthContext } from "../context/AuthContext"
import { SocketContext, SocketContext } from "../context/SocketContext"
import { useEffect } from "react"
const ChatWindow = () =>{

    const {user} = useContext(AuthContext)
    const {SocketContext}= useContext(SocketContext)

    const[messages,setMessages]= useState([]);
    const [text,setText] = useState("");

    //fetch chat back

    useEffect(()=>{
        if (!SelectedGroup) {
            return;
            
        }
        const fetchMessages = async () => {

            try {
                const res = await 
                axios.get(`http://localhost:5000/api/v1/messages/${selectedGroup._id}`);
                if (res.data.success) {

                    setMessages(res.data.data)
                    
                }
            } catch (error) {

                console.error("failed to fetch messages",error)
                
            }
            fetchMessages();
            
        }
    },[SelectedGroup]);


    //socket for live messages

    useEffect(()=>{
        if (!socket) {
            
            return;
            
        }
        socket.on("newMessage",(newMsg)=>{


            if (selectedGroup && selectedGroup._id === newMsg.conversationId) { 
                 setMessages((prev) => [...prev, newMsg]);
            }


        });

        return()=> socket.off("newMessages")
    },[socket,selectedGroup])


    //send messages

    const handleSend = async (e) => {
        
        e.preventDefault();
        if (!text.trim()||!selectedGroup) {
        
                return

            
        }

        try {
           
                const res = await axios.post(`http://localhost:5000/api/v1/messages/${selectedGroup._id}`, { text });

                if (res.data.success) {
                    setMessages((prev) => [...prev, res.data.data]);
                    setText(""); 
                    
                }
        } catch (error) {

            console.error("Failed TO send Msg",error)
            
        }
        
    }

    if (!selectedGroup) {

        return <div>Pick A group Chat to Start</div>;
        
    }


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


export default ChatWindow