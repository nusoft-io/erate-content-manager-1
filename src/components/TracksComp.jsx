import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import '../styles/TracksComp.scss';

function TracksComp({ activeComp }) {

  const [modules, setModules] = useState([])

  useEffect(() => {
    fetch('/api/gettrackmodules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('fetched modules..', data)
        console.log('clicked track', activeComp)
        // setModules(data)
      })
  }, [activeComp]);



  return (
    <>
      <div className="content">
        tracks stuff
        <div>{modules}</div>
      </div>
    </>
  )
}

export default TracksComp