import React, { useState, useEffect, act } from 'react';
import Sidebar from './Sidebar.jsx';
import '../styles/TracksComp.scss';

function TracksComp({ activeComp }) {


  const [modules, setModules] = useState([]);

  const TrackNames = {
    'man_sales': 'Manufactuer Sales',
    'man_mgmt': 'Manufactuer Management',
    'man_mrkt': 'Manufactuer Marketing',
    'sp_sales': 'Service Provider Sales',
    'sp_mgmt': 'Service Provider Management',
    'sp_opsinv': 'Service Provider Sales Operations and Inventory'
  }

  useEffect(() => {
    fetch('/api/gettrackmodules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activeComp })
    })
      .then(res => res.json())
      .then(data => {
        // console.log('fetched modules..', data);
        if (data.length > 0) {
          setModules(data);
        } else {
          setModules('No modules found for the selected track');
        }
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
        setModules('Error fetching modules');
      });
  }, [activeComp]);


  // function checkModules() {
  //   console.log('modules:', modules)
  // }
  // checkModules();

  return (
    <>
      <div className="content">
        <div>{TrackNames[activeComp]}</div>
        <div>
          {Array.isArray(modules) ? (
            modules.map((module, index) => (
              <div key={index} className='track-module-item'>
                {module}
              </div>
            ))
          ) : (
            <div>{modules}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default TracksComp;
