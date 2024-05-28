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
    console.log('trackId', trackId)
    const queryStr = `SELECT * FROM track_module_match WHERE track_id = ?;`;
    const response = await db.query(queryStr, [trackId]);
    const trackModules = [];
    const trackModuleNames = [];
    let hasOrder = true;
    // loop over the response and get the module ids and add to trackModules arr
    response.forEach((module) => {
      if (!module.module_order) hasOrder = false;
      trackModules.push({'Module Id' : module.module_id});
    });
    // loop over the track modules arr and get the module names
    for (let i = 0; i < trackModules.length; i++) {
      const queryStr2 = `SELECT module_name FROM modules WHERE module_id = ?;`;
      const response2 = await db.query(queryStr2, [trackModules[i]['Module Id']]);
      trackModuleNames.push(response2[0].module_name);
    }
    // send the module names back to frontend 
    res.locals.trackModules = {'modules': trackModuleNames, 'hasOrder' : hasOrder};
  } catch (err) {
    return next({
      log: 'trackController.getTrackModules: ERROR: Invalid request',
      message: { err: 'trackController.getTrackModules: ERROR: Check server logs for details' },
    });
  }
  return next();
};



module.exports = trackController;