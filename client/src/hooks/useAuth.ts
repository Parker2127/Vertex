import { useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for authentication status
    const authStatus = localStorage.getItem("isLoggedIn");
    const userData = localStorage.getItem("user");
    
    if (authStatus === "true" && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return {
    isLoggedIn,
    user,
    isLoading,
    login,
    logout
  };
}