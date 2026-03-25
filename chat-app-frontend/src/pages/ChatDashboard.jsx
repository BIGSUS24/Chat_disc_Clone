import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"

const ChatDashboard = () =>{
    return(
        <div style={{display:"flex",height:"100vh"}}>
            <Sidebar />
            <ChatWindow />
        </div>
    )

}
export default ChatDashboard