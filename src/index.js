import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter,Router, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";
import TracksComp from "./components/TracksComp.jsx";
import ModulesComp from "./components/ModulesComp.jsx";
import QuestionsComp from "./components/QuestionsComp.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

