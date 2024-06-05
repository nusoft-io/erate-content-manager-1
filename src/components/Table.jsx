import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useForm } from "react-hook-form";


const TrackNames = {
  'man_sales': 'Manufacturer Sales',
  'man_mgmt': 'Manufacturer Management',
  'man_mrkt': 'Manufacturer Marketing',
  'sp_sales': 'Service Provider Sales',
  'sp_mgmt': 'Service Provider Management',
  'sp_opsinv': 'Service Provider Sales Operations and Inventory'
};

function Row(props) {
  const { row, deleteModule, updateVideoLink}  = props;
  const [open, setOpen] = useState(false);
  const {register, handleSubmit} = useForm();

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.module_name}
        </TableCell>
        <TableCell>
          <button onClick={() => { deleteModule(row.module_id) }}>Delete Module</button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Video Link
              </Typography>
              <form onSubmit={handleSubmit((data) => {
                updateVideoLink(row.module_id, data.video_link);
              })}>
                <input {...register('video_link')} placeholder='New Video Link' />
                <input type="submit" />
              </form>
              <Typography variant="body1">
                {row.video_link ? (
                  <a href={row.video_link} target="_blank" rel="noopener noreferrer">
                    {row.video_link}
                  </a>
                ) : (
                  "No video link available"
                )}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Attached Tracks
              </Typography>
              <Typography variant="body1">
                {row.attachedTracks && row.attachedTracks.length > 0 ? (
                  row.attachedTracks.map((track, index) => (
                    <span key={index}>{TrackNames[track.track_name]}</span>
                  ))
                ) : (
                  "Not connected to any tracks"
                )}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}


// MAIN FUNCTION //
export default function ModulesTable() {

  const [allModules, setAllModules] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchAllModules();
    setRefresh(false);
  }, [refresh]);


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
          setRefresh(true);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  function updateVideoLink(moduleId, videoLink){
    console.log(moduleId, videoLink);
    fetch('/api/updatevideolink',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ moduleId: moduleId, videoLink: videoLink })
    })
    .then(response => response.json())
    .then(data => {
      setRefresh(true);
    })
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Module Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allModules.map((module) => (
            <Row key={module.module_id} row={module} deleteModule={deleteModule} updateVideoLink={updateVideoLink}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
