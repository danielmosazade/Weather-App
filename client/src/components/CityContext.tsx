import React, { createContext, useContext, useState, ReactNode } from "react";

interface CityContextType {
  city: string;
  setCity: (city: string) => void;
  username:string;
  setUsername:(username: string) => void;
  isAdmin:boolean;
    setIsAdmin:(isAdmin: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [city, setCity] = useState<string>("תל אביב");
    const [username, setUsername] = useState<string>("");
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

  return (
    <CityContext.Provider value={{ city, setCity,username,setUsername,isAdmin,setIsAdmin }}>
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
