import React from "react";
import { useState } from "react";
import '../styles/App.scss';
import Sidebar from "./Sidebar.jsx";
import TracksComp from "./TracksComp.jsx";
import EditModulesComp from "./EditModulesComp.jsx";
import AddModulesComp from "./AddModulesComp.jsx";
import AddQuestionComp from "./AddQuestionComp.jsx";
import EditQuestionComp from "./EditQuestionComp.jsx";
import InitComp from "./InitComp.jsx";



export default function App() {

  const [activeComp, setActiveComp] = useState('initComp');

  const renderComp = (comp) => {
    switch (comp) {
      case 'initComp':
        return <InitComp />;
      
      case 'man_sales':
        return <TracksComp activeComp={activeComp}/>;
      case 'man_mgmt':
        return <TracksComp activeComp={activeComp}/>;
      case 'man_mrkt':
        return <TracksComp activeComp={activeComp}/>;
      case 'sp_sales':
        return <TracksComp activeComp={activeComp}/>;
      case 'sp_mgmt':
        return <TracksComp activeComp={activeComp}/>;
      case 'sp_opsinv':
        return <TracksComp activeComp={activeComp}/>;



      case 'EditModule':
        return <EditModulesComp />;
      case 'AddModule':
        return <AddModulesComp />;

      case 'AddQuestion':
        return <AddQuestionComp />;
      case 'EditQuestion':
        return <EditQuestionComp />; 
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