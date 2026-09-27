import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { UNAUTHORIZED_EVENT } from "../utils/api";

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

  // Any API call answered with 401 means the session cookie is gone, so
  // drop the stale stored user too (ProtectedRoute then sends them to
  // /sign-in).
  useEffect(() => {
    const onUnauthorized = () => {
      if (!localStorage.getItem("user")) return;
      localStorage.removeItem("user");
      setUser(null);
      toast.info("Your session has expired, please sign in again.");
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  // On load, check the stored user against the server: if the cookie
  // expired while the app was closed, sign out now rather than waiting
  // for the first failing request.
  useEffect(() => {
    if (!localStorage.getItem("user")) return;
    fetch("/api/users/currentuser")
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res && res.currentUser === null) {
          window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
        }
      })
      .catch(() => {
        // Network/server error: can't tell, keep the user signed in.
      });
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
