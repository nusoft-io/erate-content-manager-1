import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';

function EditModulesComp() {

  const [allModules, setAllModules] = useState([]);

  useEffect(() => {
    fetchAllModules();
  }, []); 

  function fetchAllModules() {
    fetch('/api/getallmodules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => setAllModules(data));
  }


  // function deleteModule(moduleId) {
  //   console.log(moduleId);
  //   fetch('/api/deletemodule', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ moduleId: moduleId })
  //   })
  //   .then(() => {
  //     fetchAllModules();
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // }


  function deleteModule(moduleId) {
    console.log(moduleId);
    const confirmation = window.confirm("Are you sure you want to delete this module?");
    if (confirmation) {
      fetch('/api/deletemodule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moduleId: moduleId })
      })
      .then(() => {
        fetchAllModules();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }



  return (
    <>
      <div className="content">
        module stuff
        <div>
          {allModules.map((module, index) => {
            return (
              <div key={module.module_id}>
                <span>{module.module_name}</span>
                <button onClick={() => {deleteModule(module.module_id)}}>Delete Module</button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default EditModulesComp