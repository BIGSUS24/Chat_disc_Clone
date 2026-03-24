import axios from "axios";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";

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

            const res =  await axios.post("http://localhost:5000/api/v1/auth/signup",{
                username,
                email,
                password
            });
            if (res.data.success) {
                setUser(res.data.data);
                navigate("/");
            }
            
        } catch (error) {
            setError(error.response?.data?.message || "Registration Failed");
            
        }

        
    };

    return (
        <div>
            <h2>Create An Account</h2>
            {error && <p style={{color:"red"}}>{error}</p>}

            <form onSubmit={handleRegister}>
                <input type="text"
                placeholder="Username"
                value={username}
                onChange={(e)=> setUsername(e.target.value) }
                required/>

                <input type="email" 
                placeholder="Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required/>

                <input type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                required/>

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )



}
export default Register;