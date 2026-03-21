import { createContext,useState,useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{

    const [user,setUser] = useState(null);

    const[loading, setLoading] = useState(true);

     // CRITICAL: Tells Axios to always include our "VIP Pass" (the secure cookie) with every request


     axios.defaults.withCredentials = true;

     useEffect(()=>{

        const checkUser = async () => {
 // Hitting the /me route we built earlier in the backend!
            try {
                const res = await axios.get("http://localhost:5000/api/v1/auth/me");
                if (res.data.success) {

                    setUser(res.data.data); // Save the user data to our context
                    
                }
            } catch (error) {
                console.log("no saved session found");
                setUser(null);
                
            }
            finally{
                setLoading(false);
            }
            
        };

        checkUser();
    
     },[])


     return (
    <AuthContext.Provider value={{user,setUser,loading}}>
        {children}
    </AuthContext.Provider>
)


}

