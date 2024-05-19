import React from "react";
import '../styles/App.scss';
import Sidebar from "./Sidebar.jsx";



export default function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
      </div>
    </div>
  );
}