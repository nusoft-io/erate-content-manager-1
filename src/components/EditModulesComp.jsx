import React, { useState, useEffect } from 'react';
import Table from './Table.jsx';


function EditModulesComp() {


  return (
    <>
    <div className='edit-mod-title-container'>
      <div className='edit-mod-title'>Edit Modules</div>
    </div>

        {/* <div>
          {allModules.map((module, index) => {
            return (
              <div key={module.module_id}>
                <span>{module.module_name}</span>
                <button onClick={() => {deleteModule(module.module_id)}}>Delete Module</button>
              </div>
            )
          })}
        </div> */}

      <Table />


    </>
  )
}

export default EditModulesComp