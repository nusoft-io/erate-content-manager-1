const db = require('../database.js')

const moduleController = {};


moduleController.addModule = async (req, res, next) => {
  try{
    const moduleData = {
      module_name: req.body.module_name,
      video_link: req.body.video_link,
    }
    const intended_track = req.body.intended_track;

    // add in the module to the modules table
    const queryStr = `INSERT INTO modules (module_name, video_link) VALUES (?,?)`;
    await db.query(queryStr, [moduleData.module_name, moduleData.video_link]);

    // if the module is intended for a track, add it to the track_module_match table
    if (intended_track.length) {
      for (let el of intended_track) {
      const moduleIdQuery = `SELECT module_id FROM modules WHERE module_name = ?`;
      const moduleId = await db.query(moduleIdQuery, [moduleData.module_name]);

      const matchTableQuery = `INSERT INTO track_module_match (track_id, module_id) VALUES (?, ?)`;
      await db.query(matchTableQuery, [el, moduleId[0].module_id]);
      }
    }

  } catch (err) {
    return next({
      log: 'moduleController.addModule: ERROR: Invalid request',
      message: { err: 'moduleController.addModule: ERROR: Check server logs for details' },
    });
  }
  return next();
};



moduleController.getAllModules = async (req, res, next) => {
  try{
    const queryStr = `SELECT * FROM modules`;
    const allModules = await db.query(queryStr);
    res.locals.allModules = allModules;
  } catch (err) {
    return next({
      log: 'moduleController.getAllModules: ERROR: Invalid request',
      message: { err: 'moduleController.getAllModules: ERROR: Check server logs for details' },
    });
  }
  return next();
};


moduleController.deleteModule = async (req, res, next) => {
  try{
    const moduleId = req.body.moduleId;
    console.log('checking hereee',moduleId)
    const queryStr = `DELETE FROM modules WHERE module_id = ?`;
    await db.query(queryStr, [moduleId]);
    const queryStr2 = `DELETE FROM track_module_match WHERE module_id = ?`;
    await db.query(queryStr2, [moduleId]);
  } catch (err) {
    return next({
      log: 'moduleController.deleteModule: ERROR: Invalid request',
      message: { err: 'moduleController.deleteModule: ERROR: Check server logs for details' },
    });
  }
  return next();
};

module.exports = moduleController;
