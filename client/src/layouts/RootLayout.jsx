import { Navigate, useLocation } from "react-router-dom";
import Navbars from "../Component/Navbar";
import { useAuth } from "../hooks/useAuth";

function RootLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" />;
  else {
    return (
      <div className={`flex bg-main w-full ${location.pathname !== "/login" ? 'h-full min-h-screen' : 'h-screen'} flex flex-col items-center justify-between`}>
        <main className="w-full h-full">
          {location.pathname !== "/login" ? <Navbars /> : <></>}
          <div className="mt-20">
            {children}
          </div>
        </main>
        <footer className="mt-8">
          <span className="text-[#242c32] text-sm font-semibold tracking-wide">&copy;2024 Atarimae Agency & Creative Soldier</span>
        </footer>
      </div>
    );
  }
}

export default RootLayout;
