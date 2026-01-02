import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const MenuContext = createContext();

// Use the environment variable or fallback to localhost
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const API = `${BACKEND_URL}/api`;

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Create a function to fetch the menu that can be called anytime
  const refreshMenu = useCallback(() => {
    setLoading(true);
    axios
      .get(`${API}/menu`)
      .then((res) => {
        setMenu(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, []);

  // Fetch initial data
  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  // 2. Helper function to get filtered categories easily
  const getCategory = (categoryName) => {
    return menu.filter(
      (item) => item.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  const sortedMenu = [...menu].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <MenuContext.Provider value={{ menu, sortedMenu, setMenu, refreshMenu, getCategory, loading }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}