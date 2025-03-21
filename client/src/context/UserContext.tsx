import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface UserContextType {
  user: User | null;
  login: (username: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("stacktalk-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("stacktalk-user");
      }
    }
  }, []);

  // Login function - creates or fetches a user
  const login = async (username: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      // We now return existing users with 200 status
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to login");
      }

      const userData: User = await response.json();
      setUser(userData);
      localStorage.setItem("stacktalk-user", JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("stacktalk-user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
