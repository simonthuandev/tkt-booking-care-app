import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.scss";
import App from "./App";
import setupInterceptors from "./api/setupInterceptors";

setupInterceptors(store);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>,
  {/* </StrictMode>, */ }
);