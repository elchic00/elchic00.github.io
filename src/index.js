import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { App } from "./App";
import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Use createRoot in React 18 for client rendering
const root = ReactDOM.createRoot(rootElement);

root.render(
    <HashRouter>
      <App />
    </HashRouter>
);
