import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();// Stop the page from reloading

        try {

            const res = await axios.post("http://localhost:5000/api/v1/auth/login",
                {
                    username,
                    password
                });

            if (res.data.success) {
                setUser(res.data.data);
                navigate("/");
            }
        } catch (err) {

            setError(err.response?.data?.message || "Login Failed")

        }

    }
    return (
        <div>
            <h2>Welcome</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <input type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                <button type="submit">Log In</button>
            </form>
            <p>
                Don't have an account?
                <Link to="/register">Register</Link>
            </p>

        </div>
    )
}

export default Login;