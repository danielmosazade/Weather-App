import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CityContextType {
  city: string;
  setCity: (city: string) => void;
  username: string;
  setUsername: (username: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string>("תל אביב");
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") || ""
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(
    JSON.parse(localStorage.getItem("isAdmin") || "false")
  );

  useEffect(() => {
    // בדיקה אוטומטית אם המשתמש מחובר
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://mzgn-htb.onrender.com/api/auth/me`, {
            method: "GET",
          credentials: "include", // שולח את ה-cookie
        });
        if (!res.ok) return; // אין משתמש מחובר
        const data: { username: string; role: string } = await res.json();
        setUsername(data.username);
        setIsAdmin(data.role === "admin");
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <CityContext.Provider
      value={{ city, setCity, username, setUsername, isAdmin, setIsAdmin }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
