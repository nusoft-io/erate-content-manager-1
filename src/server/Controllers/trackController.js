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
    // console.log('trackId', trackId)
    const queryStr = `SELECT * FROM track_module_match WHERE track_id = ?;`;
    const response = await db.query(queryStr, [trackId]);
    console.log(response)
    const trackModulesUnordered = [];
    const trackModuleNames = [];
    let hasOrder = true;
    // loop over the response and get the module ids and add to trackModules arr
    response.forEach((module) => {
      if (!module.module_order) {
        hasOrder = false;
      }
      trackModulesUnordered.push({'Module Id' : module.module_id, 'Module Order' : module.module_order});
    });
    // console.log('unordered',trackModulesUnordered)
    let trackModulesOrdered = trackModulesUnordered.sort((a, b) => a['Module Order'] - b['Module Order']);
    // console.log('ordered',trackModulesOrdered)
    // if there is order do same query but order by module_order

    // loop over the track modules arr and get the module names
    for (let i = 0; i < trackModulesOrdered.length; i++) {
      const queryStr2 = `SELECT * FROM modules WHERE module_id = ?;`;
      const response2 = await db.query(queryStr2, [trackModulesOrdered[i]['Module Id']]);
      // send more info back to frontend
      // trackModuleNames.push(response2[0].module_name);
      // console.log('the response', response2)
      trackModuleNames.push({'modName' :response2[0].module_name, 'modId': response2[0].module_id});
    }
    // send the module names back to frontend 
    // console.log('trackModuleNames', trackModuleNames)
    res.locals.trackModules = {'modules': trackModuleNames, 'hasOrder' : hasOrder};
  } catch (err) {
    return next({
      log: 'trackController.getTrackModules: ERROR: Invalid request',
      message: { err: 'trackController.getTrackModules: ERROR: Check server logs for details' },
    });
  }
  return next();
};

trackController.removeTrackModule = async (req, res, next) => {
  try {
    console.log('req.body', req.body )
    const module_id = req.body.modId;
    const track_id = trackMatcher[req.body.track];
    // add active track to query
    const queryStr = `DELETE FROM track_module_match WHERE module_id = ? AND track_id = ?;`;
    await db.query(queryStr, [module_id, track_id]);
    res.locals.removed = true;
  } catch (err){
    return next({
      log: 'trackController.removeTrackModule: ERROR: Invalid request',
      message: { err: 'trackController.removeTrackModule: ERROR: Check server logs for details' },
    });
  }
  return next();
};


module.exports = trackController;