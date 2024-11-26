import { createContext, useState, useContext, useEffect } from "react";
import { fetchUserData } from "../services/userService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  // Function to update user data from backend
  const refreshUserData = async () => {
    if (token && !isAdmin) {
      try {
        const decoded = jwtDecode(token);
        const userData = await fetchUserData(token, decoded.userId);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Failed to refresh user data:", err);
      }
    }
  };

  useEffect(() => {
    if (token && !isAdmin) {
      refreshUserData();
    }
  }, [token, isAdmin]);

  const login = async (username, password) => {
    try {
      const response = await fetch(
        "https://mystery-back.vercel.app/api/auth/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return false;
      }

      localStorage.setItem("userToken", data.token);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");

      setToken(data.token);
      setAdminToken(null);
      setIsAdmin(false);

      await refreshUserData();
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to connect to the server");
      return false;
    }
  };

  const adminLogin = async (username, password) => {
    try {
      const response = await fetch(
        "https://mystery-back.vercel.app/api/auth/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log(" ");

      if (!response.ok) {
        setError(data.error);
        return false;
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("isAdmin", "true");
      localStorage.removeItem("userToken");

      setAdminToken(data.token);
      setToken(null);
      setUser(data.admin);
      setIsAdmin(true);

      setError(null);
      return true;
    } catch (err) {
      setError("Failed to connect to the server");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setUser(null);
    setToken(null);
    setAdminToken(null);
    setIsAdmin(false);
    setError(null);
  };

  const value = {
    user,
    token: isAdmin ? adminToken : token,
    error,
    login,
    adminLogin,
    logout,
    isAuthenticated: isAdmin ? !!adminToken : !!token,
    isAdmin,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
