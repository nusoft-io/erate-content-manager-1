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
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tracks" element={<TracksComp />} />
        <Route path="/modules" element={<ModulesComp />} />
        <Route path="/questions" element={<QuestionsComp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

