import axios from "axios";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Register= () =>{
    const [username,setUsername] = useState("");
    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");
    const [error,setError]=useState("");

    // grab user From db or cloud

    const {setUser} = useContext(AuthContext);

    const navigate = useNavigate();

    const handleRegister = async (e) => {

        e.preventDefault(); // does not refresh while credentials are submitted

        try {

            const res =  await axios.post("https//localhost:5000/api/v1/signup"){
                username,
                email,
                password
            }
            if (res.data.success) {
                setUser(res.data.user);
                navigate("/");
            }
            
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed");
            
        }

        
    };

    return (
        <div>
            <h2>Create An Account</h2>
            {error &&}
        </div>
    )



}