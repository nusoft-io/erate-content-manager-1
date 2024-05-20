const db = require('../database.js')

const trackController = {};


const trackMatcher = {
  'man_sales': 1,
  'man_mgmt': 2,
  'man_mrkt': 3,
  'sp_sales': 4,
  'sp_mgmt': 5,
  'sp_opsinv': 6,
}

// trackController.addModule = async (req, res, next) => {
//   try{
//     const moduleData = req.body;


//     // console.log(moduleData);
//     // console.log(typeof moduleData.module_name);
//     const queryStr = `INSERT INTO modules (module_name) VALUES (?)`;
//     const queryValues = [moduleData.module_name];
//     const response = await db.query(queryStr, queryValues);
//     console.log(response);
//   } catch (err) {
//     return next({
//       log: 'dbController.addModule: ERROR: Invalid request',
//       message: { err: 'dbController.addModule: ERROR: Check server logs for details' },
//     });
//   }
//   return next();
// };

trackController.getTrackModules = async (req, res, next) => {
  try{
    const trackId = trackMatcher[req.body.activeComp];
    const queryStr = `SELECT * FROM track_module_match WHERE track_id = ?;`;
    const response = await db.query(queryStr, [trackId]);
    console.log('looking here',response);
    const trackModules = [];
    // response.forEach((module) => {
    //   allModules.push({'Module Name' : module.module_name , 'Module Id' : module.module_id});
    // });
    res.locals.trackModules = trackModules;
  } catch (err) {
    return next({
      log: 'trackController.getTrackModules: ERROR: Invalid request',
      message: { err: 'trackController.getTrackModules: ERROR: Check server logs for details' },
    });
  }
  return next();
};

module.exports = trackController;