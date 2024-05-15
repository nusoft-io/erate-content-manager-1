import React from 'react'
import ModulesDash from './ModulesDash.jsx'


function DataContainer() {

  function testDB() {
    fetch('/api/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }



  return (
    <>
      <div>DataContainer</div>
      <button onClick={testDB}>get all users</button>
      <ModulesDash />
    </>
  )
}

export default DataContainer;