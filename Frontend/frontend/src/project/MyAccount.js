
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../projectCss/MyAccount.css";

const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

const MyAccount = () => {
    const { user, token, logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/user/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load profile.");
                }

                setProfile(data.user);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <div className="account-page">Loading your account...</div>;
    }

    if (error) {
        return (
            <div className="account-page">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="account-page">

            <div className="account-breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>My Account</span>
            </div>

            <section className="account-container">
                <div className="account-heading">
                    <h2>My Account</h2>
                    <p>Welcome back, {profile.first_name}!</p>
                </div>

                <div className="account-profile">
                    <h3>Personal Information</h3>

                    <div className="account-detail">
                        <span>First Name</span>
                        <strong>{profile.first_name}</strong>
                    </div>

                    <div className="account-detail">
                        <span>Last Name</span>
                        <strong>{profile.last_name}</strong>
                    </div>

                    <div className="account-detail">
                        <span>Email</span>
                        <strong>{profile.email}</strong>
                    </div>

                    <div className="account-detail">
                        <span>Account Type</span>
                        <strong>{profile.role}</strong>
                    </div>
                </div>

                <button
                    className="account-logout-button"
                    onClick={() => {
                        logout();
                        window.location.href = "/";
                    }}
                >
                    LOGOUT
                </button>
            </section>
        </main>
    );
};

export default MyAccount;
