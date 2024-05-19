import React from 'react';
import '../styles/Sidebar.scss';
import dropdownIcon from '../assets/icons/icons8-dropdown-50.png';



function Sidebar() {
  return (
    <>
      <div className='sidebar-container'>

        <ul className='sb-menu-container'>
          <li className='sb-menu-item'>
            <div className='sb-menu-item-title'>
              <a href="/tracks">Tracks</a>
              <img src={dropdownIcon} />
            </div>
          </li>
          <li className='sb-menu-item'>
          <div className='sb-menu-item-title'>
          <a href="/modules">Modules</a>
            <img src={dropdownIcon} />
          </div>
          </li>
          <li className='sb-menu-item'>
          <div className='sb-menu-item-title'>
          <a href="/questions">Questions</a>
            <img src={dropdownIcon} />
          </div>
          </li>
        </ul>

      </div>
    </>
  )
}



export default Sidebar