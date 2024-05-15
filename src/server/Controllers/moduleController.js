const db = require('../database.js')

const moduleController = {};


moduleController.addModule = async (req, res, next) => {
  try{
    const moduleData = req.body;
    // console.log(moduleData);
    // console.log(typeof moduleData.module_name);
    const queryStr = `INSERT INTO modules (module_name) VALUES (?)`;
    const queryValues = [moduleData.module_name];
    const response = await db.query(queryStr, queryValues);
    console.log(response);
  } catch (err) {
    return next({
      log: 'dbController.addModule: ERROR: Invalid request',
      message: { err: 'dbController.addModule: ERROR: Check server logs for details' },
    });
  }
  return next();
};

moduleController.getModules = async (req, res, next) => {
  try{
    const queryStr = `SELECT * FROM modules`;
    const response = await db.query(queryStr);
    // console.log('from backend',response);
    const allModules = [];
    response.forEach((module) => {
      allModules.push({'Module Name' : module.module_name , 'Module Id' : module.module_id});
    });
    // console.log(allModules);
    res.locals.allModules = allModules;
  } catch (err) {
    return next({
      log: 'dbController.getModules: ERROR: Invalid request',
      message: { err: 'dbController.getModules: ERROR: Check server logs for details' },
    });
  }
  return next();
};

module.exports = moduleController;