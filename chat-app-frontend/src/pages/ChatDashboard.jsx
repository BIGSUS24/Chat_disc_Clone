import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"
import { useState } from "react"

const ChatDashboard = () =>{

    const [selectedGroup ,setSelectedGroup] = useState(null);

    return(
        <div style={{display:"flex",height:"100vh"}}>
            <Sidebar setSelectedGroup={setSelectedGroup}/>
            <ChatWindow setSelectedGroup ={selectedGroupelectedGroup}/>
        </div>
    )

}
export default ChatDashboard