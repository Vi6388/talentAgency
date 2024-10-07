import React from "react";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./hooks/useAuth";
import routes from "./constant/routes";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};

export default App;
