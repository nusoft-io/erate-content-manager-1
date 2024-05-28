import React, { useState, useEffect, act } from 'react';
import { Reorder } from "framer-motion"
import '../styles/TracksComp.scss';

function TracksComp({ activeComp }) {


  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [hasOrder, setHasOrder] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const TrackNames = {
    'man_sales': 'Manufactuer Sales',
    'man_mgmt': 'Manufactuer Management',
    'man_mrkt': 'Manufactuer Marketing',
    'sp_sales': 'Service Provider Sales',
    'sp_mgmt': 'Service Provider Management',
    'sp_opsinv': 'Service Provider Sales Operations and Inventory'
  }

  // POPULATE MODULES //
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
        setHasOrder(data.hasOrder);
        if (data.modules.length > 0) {
          setModules(data.modules);
          setItems(data.modules);
        } else {
          setModules('No modules found for the selected track');
          setItems([]);
        }
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
        setModules('Error fetching modules');
      });
  }, [activeComp]);

  // ORDER CHANGED //
  function saveOrderChanges() {
    fetch('/api/updateModuleOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    })
      .then(res => res.json())
      .then(data => {
        console.log('Order updated successfully..');
        setHasOrder(true);
      })
      .catch(error => {
        console.error('Error updating order:', error);
    })

  }




  return (
    <>
      <div className="content">
        <div>{TrackNames[activeComp]}</div>

        {!hasOrder ? <div>SET MODULE ORDER</div> : null}

        {unsavedChanges ? <div>Unsaved Changes</div> : null}


        <button onClick={saveOrderChanges}>Save Changes</button>

        <Reorder.Group as="ol" axis="y" values={items} onReorder={setItems}>
          {items.map((item) => (
            <Reorder.Item className='module-item' key={item} value={item}>
              {item}
            </Reorder.Item>
          ))}
        </Reorder.Group>

      </div>
    </>
  );
}

export default TracksComp;
