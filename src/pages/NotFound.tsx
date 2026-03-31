import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-display text-6xl font-bold text-foreground">404</h1>
          <p className="mb-6 text-xl font-body text-muted-foreground">Oops! Page not found</p>
          <Link to="/" className="font-body text-forest-mid hover:underline text-lg">
            Return to Home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
