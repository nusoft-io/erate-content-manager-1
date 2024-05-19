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
        <li className={`sb-menu-item ${expanded === 'TracksComp' ? 'expanded' : ''}`}>
          <div className='sb-menu-item-title' onClick={() => toggleExpand('TracksComp')}>
            <span>Tracks</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
          {expanded === 'TracksComp' && (
            <>
            <ul className='sub-items-ul'>
              <li className='sb-submenu-item' onClick={() => setActiveComp('Man-Sales')}>
                <div className='sb-menu-item-title'>
                  <span>Manufactuer Sales</span>
                </div>
              </li>
              <li className='sb-submenu-item' onClick={() => setActiveComp('Man-Mgmt')}>
                <div className='sb-menu-item-title'>
                  <span>Manufacturer Management</span>
                </div>
              </li>
              <li className='sb-submenu-item' onClick={() => setActiveComp('Man-Mrkt')}>
                <div className='sb-menu-item-title'>
                  <span>Manufacturer Marketing</span>
                </div>
              </li>
              <li className='sb-submenu-item' onClick={() => setActiveComp('SP-Sales')}>
                <div className='sb-menu-item-title'>
                  <span>Service Provider Sales</span>
                </div>
              </li>
              <li className='sb-submenu-item' onClick={() => setActiveComp('SP-Mgmt')}>
                <div className='sb-menu-item-title'>
                  <span>Service Provider Management</span>
                </div>
              </li>
              <li className='sb-submenu-item' onClick={() => setActiveComp('SP-Ops')}>
                <div className='sb-menu-item-title'>
                  <span>Service Provider Sales Operations/Invoicing</span>
                </div>
              </li>
            </ul>
            </>
          )}
        </li>
        <li className={`sb-menu-item ${expanded === 'ModulesComp' ? 'expanded' : ''}`}>
          <div className='sb-menu-item-title' onClick={() => toggleExpand('ModulesComp')}>
            <span>Modules</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
          {expanded === 'ModulesComp' && (
            <>
             <ul className='sub-items-ul'>
                <li className='sb-submenu-item' onClick={() => setActiveComp('EditModule')}>
                  <div className='sb-menu-item-title'>
                    <span>Edit Module</span>
                  </div>
                </li>
                <li className='sb-submenu-item' onClick={() => setActiveComp('AddModule')}>
                  <div className='sb-menu-item-title'>
                    <span>Add Module</span>
                  </div>
                </li>
              </ul>
            </>
          )}
        </li>
        <li className={`sb-menu-item ${expanded === 'QuestionsComp' ? 'expanded' : ''}`}>
          <div className='sb-menu-item-title' onClick={() => toggleExpand('QuestionsComp')}>
            <span>Questions</span>
            <img src={dropdownIcon} alt="dropdown" />
          </div>
          {expanded === 'QuestionsComp' && (
            <>
             <ul className='sub-items-ul'>
                <li className='sb-submenu-item' onClick={() => setActiveComp('EditQuestion')}>
                  <div className='sb-menu-item-title'>
                    <span>Edit Question</span>
                  </div>
                </li>
                <li className='sb-submenu-item' onClick={() => setActiveComp('AddQuestion')}>
                  <div className='sb-menu-item-title'>
                    <span>Add Question</span>
                  </div>
                </li>
              </ul>
            </>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
