import React, { useState, useEffect } from 'react';
import Table from './Table.jsx';
import '../styles/EditModulesComp.scss';


function EditModulesComp() {


  return (
    <>
      <div className='edit-mod-title-container'>
        <div className='edit-mod-title'>Edit Modules</div>
      </div>

      <div className='mod-help-msg'>Below Are All Modules. Click The Dropdown For Any Module To See/Edit Module Details</div>



      <Table />
    </>
  )
}

export default EditModulesComp