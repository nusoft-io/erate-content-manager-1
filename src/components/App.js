import React from "react";
import { useState } from "react";
import '../styles/App.scss';
import Sidebar from "./Sidebar.jsx";
import TracksComp from "./TracksComp.jsx";
import ModulesComp from "./ModulesComp.jsx";
import QuestionsComp from "./QuestionsComp.jsx";



export default function App() {

  const [activeComp, setActiveComp] = useState('initComp');

  const renderComp = (comp) => {
    switch (comp) {
      case 'initComp':
        return <initComp />;
      case 'TracksComp':
        return <TracksComp />;
      case 'ModulesComp':
        return <ModulesComp />;
      case 'QuestionsComp':
        return <QuestionsComp />; 
      default:
        return <initComp />;
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