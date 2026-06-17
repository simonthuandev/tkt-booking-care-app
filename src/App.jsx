import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, Slide } from "react-toastify";
import { fetchCurrentUser } from "./store/slices/authSlice";
import "react-toastify/dist/ReactToastify.css";
import router from "./routes/AppRoute";
import LoadingSpinner from "./components/Common/LoadingSpinner";

const App = () => {
  const dispatch = useDispatch();
  const { isInitializing } = useSelector((state) => state.auth);
  const isOAuthCallback = window.location.pathname === "/auth/oauth/callback";

  useEffect(() => {
    if (isOAuthCallback) return;
    dispatch(fetchCurrentUser());
  }, [dispatch, isOAuthCallback]);

  if (isInitializing && !isOAuthCallback) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      
    </>
  );
};

export default App;
