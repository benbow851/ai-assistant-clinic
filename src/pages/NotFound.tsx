
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="snes-container min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="snes-title mb-4">404</h1>
        <p className="snes-subtitle mb-6">Oops! Page not found</p>
        <a href="/" className="no-underline">
          <Button className="pixel-button">Return to Home</Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
