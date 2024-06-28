import React, { useState, useEffect, act } from 'react';
import { Reorder } from "framer-motion"
import '../styles/TracksComp.scss';
import { set } from 'react-hook-form';

function TracksComp({ activeComp }) {


  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [hasOrder, setHasOrder] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [removed, setRemoved] = useState(false);

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
          // console.log('lookking here', data.modules)
          setModules(data.modules);
          setItems(data.modules);
          setRemoved(false);

        } else {
          setModules('No modules found for the selected track');
          setItems([]);
          setRemoved(false);
        }
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
        setModules('Error fetching modules');
      });
  }, [activeComp, removed]);

  // CHANGES MADE WARNING //
  function handleChanges() {
    setUnsavedChanges(true);
  }

  // SAVE CHANGED ORDER //
  function saveOrderChanges() {
    // console.log('items order check', items)
    fetch('/api/updateModuleOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items , track: activeComp})
    })
      .then(res => res.json())
      .then(data => {
        console.log('Order updated successfully..');
        setHasOrder(true);
      })
      .catch(error => {
        console.error('Error updating order:', error);
    })
    setUnsavedChanges(false);
  }

  // REMOVE MODULE //
  function removeModule(item){
    const itemKey = item.modId;
    // console.log('item key', itemKey)
    fetch('/api/removetrackmodule',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modId: itemKey, track: activeComp })
    })
    .then(res => res.json())
    .then(data => {
      if (data) {
        setRemoved(true);
      }
    })
  }


// console.log('items', items)

  return (
    <>
      <div className="content">
        <div className='track-top-container'>
          <div className="trackTitle">Edit / Order Modules</div>

          <button className='save-changes-btn' onClick={saveOrderChanges}>Save Changes</button>
        </div>

        {/* {!hasOrder ? <div>SET MODULE ORDER</div> : null} */}
        <h2>{TrackNames[activeComp]}</h2>

        {unsavedChanges ? <div className='unsaved-warning'>Unsaved Changes</div> : null}

        <div className='track-help-msg'>Drag & Drop Module Cards To Reorder Or Click "X" To Delete The Module From The Track</div>


        <div className='mod-card-master-container'>
          <Reorder.Group as="ol" axis="y" values={items} onReorder={(reorderedItems) => { setItems(reorderedItems); handleChanges(); }}>
            {items.map((item) => (
              <Reorder.Item className='module-item' key={item.modId} value={item}>
                <div className='mod-item-text'>{item.modName}</div>
                <button className='remove-mod-btn' onClick={()=> removeModule(item)}>X</button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

      </div>
    </>
  );
}

export default TracksComp;
