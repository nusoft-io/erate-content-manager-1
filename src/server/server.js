const express =  require('express');
const moduleController = require('./Controllers/moduleController.js');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/api/addmodule',
  moduleController.addModule,
  (req, res) => {
    res.status(200).json('module added');
}
);

app.get('/api/getmodules', 
  moduleController.getModules,
  (req, res) => {
    res.status(200).json(res.locals.allModules);
});


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