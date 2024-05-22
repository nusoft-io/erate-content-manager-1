import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import '../styles/TracksComp.scss';

function TracksComp({ activeComp }) {

  const [modules, setModules] = useState([]);

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
        console.log('fetched modules..', data);
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

  return (
    <>
      <div className="content">
        <div>
          {Array.isArray(modules) ? (
            modules.map((module, index) => (
              <div key={index}>
                {module.name /* Adjust based on your module data structure */}
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
