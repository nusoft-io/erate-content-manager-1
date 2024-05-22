import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

function AddModulesComp() {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    fetch('/api/addmodule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.ok) {
        alert('Module added successfully');
        reset();
        return;
      } else {
        throw new Error('Failed to add module');
      }
    });
  };


  return (
    <>
      <div>AddModulesComp</div>
      <form className='add-module-form' onSubmit={handleSubmit(onSubmit)}>
        <input {...register('module_name', { required: true })} placeholder='Module Name' />
        <input {...register('video_link')} placeholder='Module Video Link' />
        <div className='checkbox-container'>
          <label htmlFor="option1">
            <input type="checkbox" id='option1' value="1" {...register('intended_track')}/>
            Manufacturer Sales
          </label>
          <label htmlFor="option2">
            <input type="checkbox" id='option2' value="2" {...register('intended_track')}/>
            Manufacturer Managment
          </label>
          <label htmlFor="option3">
            <input type="checkbox" id='option3' value="3" {...register('intended_track')}/>
            Manufacture Marketing
          </label>
          <label htmlFor="option4">
            <input type="checkbox" id='option4' value="4" {...register('intended_track')}/>
            Service Provider Sales
          </label>
          <label htmlFor="option5">
            <input type="checkbox" id='option5' value="5" {...register('intended_track')}/>
            Service Provider Management
          </label>
          <label htmlFor="option6">
            <input type="checkbox" id='option6' value="6" {...register('intended_track')}/>
            Service Provider Sales Operations/Invoicing
          </label>
        </div>
        <input type="submit" />
      </form>
    </>
  )
}

export default AddModulesComp