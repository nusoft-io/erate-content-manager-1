import React from 'react';
import Sidebar from './Sidebar.jsx';
import '../styles/TracksComp.scss';

function TracksComp() {
  return (
    <>
    <div className="app-container">
      <Sidebar />
      <div className="content">
        tracks stuff
      </div>
    </div>
    </>
  )
}

export default TracksComp