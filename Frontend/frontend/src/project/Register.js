
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../projectCss/Register.css";

const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const Register = () => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    });

    const [newsletter, setNewsletter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
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
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setMessage(data.message || "Registration successful!");

            setForm({
                first_name: "",
                last_name: "",
                email: "",
                password: ""
            });

            setNewsletter(false);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* Breadcrumb */}
            <div className="register-breadcrumb">
                <Link to="/">Home</Link>
                <span>◆</span>
                <span>Create an account</span>
            </div>

            {/* Registration Form */}
            <div className="register-main">

                <div className="register-heading">
                    <h2>Create an account</h2>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* First Name */}
                    <div className="register-input-group">
                        <span className="register-input-icon">♙</span>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="register-input-group">
                        <span className="register-input-icon">♙</span>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="register-input-group">
                        <span className="register-input-icon">✉</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="register-input-group">
                        <span className="register-input-icon">♙</span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            minLength={8}
                            required
                        />
                    </div>

                    {/* Newsletter */}
                    <label className="register-newsletter">
                        <input
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) =>
                                setNewsletter(e.target.checked)
                            }
                        />
                        <span>Sign up for our newsletter</span>
                    </label>

                    {/* Messages */}
                    {error && (
                        <p className="register-error">{error}</p>
                    )}

                    {message && (
                        <p className="register-success">{message}</p>
                    )}

                    {/* Login Link */}
                    <p className="register-login-text">
                        If you have an account, please{" "}
                        <Link to="/login">Login Here</Link>
                    </p>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "PLEASE WAIT..." : "REGISTER"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default Register;
