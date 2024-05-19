import React from "react";
import { useState } from "react";
import '../styles/App.scss';
import Sidebar from "./Sidebar.jsx";
import TracksComp from "./TracksComp.jsx";
import ModulesComp from "./ModulesComp.jsx";
import QuestionsComp from "./QuestionsComp.jsx";
import InitComp from "./InitComp.jsx";



export default function App() {

  const [activeComp, setActiveComp] = useState('initComp');

  const renderComp = (comp) => {
    switch (comp) {
      case 'initComp':
        return <InitComp />;
      case 'Man-Sales':
        return <TracksComp activeComp={activeComp}/>;
      case 'Man-Mrkt':
        return <TracksComp activeComp={activeComp}/>;
      case 'Man-Mgmt':
        return <TracksComp activeComp={activeComp}/>;
      case 'SP-Sales':
        return <TracksComp activeComp={activeComp}/>;
      case 'SP-Mgmt':
        return <TracksComp activeComp={activeComp}/>;
      case 'SP-Ops':
        return <TracksComp activeComp={activeComp}/>;
      case 'QuestionsComp':
        return <QuestionsComp />; 
      default:
        return <InitComp />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar setActiveComp={setActiveComp} />
      <div className="content">
        {renderComp(activeComp)}
      </div>
    </div>
  );
}