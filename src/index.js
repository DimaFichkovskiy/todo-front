import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";

// import { OverlayContextProvider } from "./context/overlay-context";
import {OverlayContextProvider} from "./context";
import {ThemeContextProvider} from "./context";
// import { ThemeContextProvider } from "./context/theme-context";
ReactDOM.render(
    <React.StrictMode>
        <ThemeContextProvider>
            <OverlayContextProvider>
                <App />
            </OverlayContextProvider>
        </ThemeContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
);