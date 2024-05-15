import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

function ModulesDash() {
  const [modules, setModules] = useState([])
  const [modAddTrigger, setModAddTrigger] = useState(false)


  // FETCH MODULES FOR STATE //
  useEffect(() => {
    fetch('/api/getmodules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('fetched modules..', data)
        setModules(data)
      })
  }, [modAddTrigger])

  // SET UP REACT-HOOK-FORM //
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // ON FORM SUBMIT FUNCTION //
  function onSubmit(data) {
    fetch('/api/addmodule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    
    if (modAddTrigger) {
      setModAddTrigger(false)
    } else {
      setModAddTrigger(true)
    }
  }


  // RETURN STATEMENT // 
  return (
    <>
      <h1>Module Dashboard</h1>

      <div>

      </div>

      <div className='add-module-container'>
        <h2>Add Module</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("module_name", {required: true})} placeholder='Module Name' />
          <input type="submit" />
        </form>
      </div>
    </>
  )
}

export default ModulesDash;