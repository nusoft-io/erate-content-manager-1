import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter,Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

