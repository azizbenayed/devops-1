import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

// Read the persisted user safely. Older versions of this app stored the
// value with an extra JSON.stringify pass, which produced a string like
// '"{\\"id\\":...}"' instead of '{"id":...}'. We unwrap that case too so
// existing sessions in the browser keep working after this fix.
const readStoredUser = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    let parsed = JSON.parse(raw);
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    return parsed;
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());

  // Keep multiple tabs in sync (e.g. logging out in one tab logs out the
  // others too).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        setUser(readStoredUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = { user, isAuthenticated: Boolean(user), login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
