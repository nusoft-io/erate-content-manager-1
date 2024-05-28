const express =  require('express');
const trackController = require('./Controllers/trackController.js');
const moduleController = require('./Controllers/moduleController.js');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ---------------- ROUTES ---------------- //
app.post('/api/gettrackmodules', 
  trackController.getTrackModules,
  (req, res) => {
    res.status(200).json(res.locals.trackModules);
});

app.post('/api/addmodule', 
  moduleController.addModule,
  (req, res) => {
    res.status(200).send('Module added successfully');
});

app.get('/api/getallmodules',
  moduleController.getAllModules,
  (req, res) => {
    res.status(200).json(res.locals.allModules);
});

app.post('/api/deletemodule',
  moduleController.deleteModule,
  (req, res) => {
    res.status(200).send('Module deleted successfully');
  }
);

app.post('/api/updateModuleOrder',
  moduleController.updateModuleOrder,
  (req, res) => {
    res.status(200).send({'message':'Order updated successfully'})
  }
 );




// GLOBAL ERROR HANDLER // 
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log('Server error occured: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});