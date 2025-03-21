import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { UserProvider, useUser } from "@/context/UserContext";
import { AppHeader } from "@/components/AppHeader";
import { LoginPage } from "@/components/LoginPage";
import { MainContent } from "@/components/MainContent";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";

function Router() {
  const { isLoggedIn } = useUser();
  const [location, setLocation] = useLocation();

  // Redirect logic
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoggedIn && location !== "/") {
      setLocation("/");
    }
    // Redirect to questions if authenticated but on login page
    else if (isLoggedIn && location === "/") {
      setLocation("/questions");
    }
  }, [isLoggedIn, location, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/questions">
          <MainContent />
        </Route>
        <Route path="/ask">
          <MainContent />
        </Route>
        <Route path="/questions/:id">
          <MainContent />
        </Route>
        <Route path="/my-questions">
          <MainContent />
        </Route>
        <Route component={NotFound} />
      </Switch>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router />
        <Toaster />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
