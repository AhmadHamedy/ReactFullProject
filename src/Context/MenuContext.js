import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const MenuContext = createContext();

const API = "http://localhost:5000/api";

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/menu`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.log(err));
  }, []);

  const sortedMenu = [...menu].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <MenuContext.Provider value={{ menu, sortedMenu, setMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
