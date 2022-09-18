import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Components/store/Store";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { ChakraProvider } from "@chakra-ui/react";
import "../node_modules/@popperjs/core/dist/esm/popper.js";
import "../node_modules/bootstrap/dist/js/bootstrap.js";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
