import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../projectCss/Login.css";


const Login = () => {
    const { login } = useAuth();
const navigate = useNavigate();
const location = useLocation();


    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
        const data = await login(form.email, form.password);

        if (data.user.role === "admin") {
  navigate("/admin", { replace: true });
} else {
  navigate(location.state?.from || "/home", { replace: true });
}
    } catch (err) {
        setError(err.message || "Unable to login.");
    } finally {
        setLoading(false);
    }
};


    return (
        <main className="login-page">

            <div className="login-breadcrumb">
                <Link to="/">Home</Link>
                <span>◆</span>
                <span>Sign In</span>
            </div>

            <section className="login-container">

                <div className="login-heading">
                    <h2>Sign In</h2>
                </div>

                <p className="login-instruction">
                    Insert your account information:
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="login-input-group">
                        <span className="login-input-icon">
                            <svg viewBox="0 0 24 24">
                                <rect x="3" y="5" width="18" height="14" rx="1"/>
                                <path d="M3 6l9 7 9-7"/>
                            </svg>
                        </span>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-input-group">

                        <span className="login-input-icon">
                            <svg viewBox="0 0 24 24">
                                <rect x="5" y="10" width="14" height="11" rx="2"/>
                                <path d="M8 10V7a4 4 0 018 0v3"/>
                            </svg>
                        </span>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            className="login-password-toggle"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    <div className="login-forgot">
                        Forgot your{" "}
                        <Link to="/forgot-password">
                            Password?
                        </Link>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <p className="login-register-text">
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register Here
                        </Link>
                    </p>

                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >
                        {loading ? "PLEASE WAIT..." : "LOGIN"}
                    </button>

                </form>
            </section>
        </main>
    );
};

export default Login;
