import { Link } from "react-router-dom";
import { AppNav } from "@/components/AppNav";

const NotFound = () => {
  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <AppNav />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div
          className="stat-number font-serif-display mb-4"
          style={{ fontSize: "80px" }}
        >
          404
        </div>
        <h1
          className="font-serif-display text-[28px] mb-3"
          style={{ color: "hsl(var(--foreground))" }}
        >
          הדף לא נמצא
        </h1>
        <p
          className="font-sans-he text-[15px] mb-8"
          style={{ color: "hsl(var(--text-dim))" }}
        >
          נראה שהגעת למקום שלא קיים — עדיין
        </p>
        <Link to="/" className="hero-cta-primary font-sans-he">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
