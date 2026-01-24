import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 1. Restore user from localStorage on initial app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // 2. Watch the 'user' state: Update Axios headers whenever it changes
  useEffect(() => {
    if (user?.token) {
      // Note: Backend expects "Token <key>", ensure this matches your Django config
      axios.defaults.headers.common["Authorization"] = `Token ${user.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // 3. Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};