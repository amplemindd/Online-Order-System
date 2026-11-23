
import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";
  console.log("PRODUCTION API URL:", API_URL);


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });



  // LOGIN
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }

    if (!data.token || !data.user) {
      throw new Error("Invalid login response from server.");
    }

    // Save token and user in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    // Remove old sessionStorage values
    sessionStorage.removeItem("greenbee_token");
    sessionStorage.removeItem("greenbee_user");

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("greenbee_token");
    sessionStorage.removeItem("greenbee_user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};
