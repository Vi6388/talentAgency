import React from "react";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./hooks/useAuth";
import routes from "./constant/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </AuthProvider>
  );
};

export default App;
