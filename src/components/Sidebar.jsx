import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.scss';
import dropdownIcon from '../assets/icons/icons8-dropdown-50.png';



function Sidebar({ setActiveComp }) {

  // ------------------ STATE DECLARATIONS --------------------- //
  const [expanded, setExpanded] = useState(false);


  // ------------------ FUNCTION DECLARATIONS ------------------- //

  // Function to toggle the expanded state of the sidebar menu
  const toggleExpand = (item) => {
    if (item === expanded) {
      setExpanded(false)
    } else {
      setExpanded(item);
    }
  };


  return (
    <div className='sidebar-container'>
      <ul className='sb-menu-container'>
        <li className='sb-menu-item'>
          <div className='sb-menu-item-title' onClick={() => toggleExpand('TracksComp')}>
            <Link to="#" onClick={() => setActiveComp('TracksComp')}>Tracks</Link>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
          {expanded === 'TracksComp' && (
            <>
              <li className='sb-submenu-item'>
                <div className='sb-menu-item-title'>
                  <Link to="#" onClick={() => setActiveComp('TracksComp')}>Edit Tracks</Link>
                </div>
              </li>
              {/* Add more dynamically rendered list items here */}
              <li className='sb-submenu-item'>
                <div className='sb-menu-item-title'>
                  <Link to="#" onClick={() => setActiveComp('TracksComp')}>Another Track</Link>
                </div>
              </li>
            </>
          )}
        </li>
        <li className='sb-menu-item'>
          <div className='sb-menu-item-title'>
            <Link to="#" onClick={() => setActiveComp('ModulesComp')}>Modules</Link>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
        </li>
        <li className='sb-menu-item'>
          <div className='sb-menu-item-title'>
            <Link to="#" onClick={() => setActiveComp('QuestionsComp')}>Questions</Link>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
        </li>
      </ul>
    </div>
  );
}



export default Sidebar