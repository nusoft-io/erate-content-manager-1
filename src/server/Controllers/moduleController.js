const db = require('../database.js')

const moduleController = {};


moduleController.addModule = async (req, res, next) => {
  try{
    const moduleData = {
      module_name: req.body.module_name,
      video_link: req.body.video_link,
    }
    const intended_track = req.body.intended_track;
    let moduleOrder = {};

    // popoulate order num for intended track
    const queryStr3 = `SELECT * FROM track_module_match WHERE track_id = ? ORDER BY module_order DESC LIMIT 1`;
    for (let el of intended_track) {
      let lastElement = await db.query(queryStr3, [el]);
      console.log('last element', lastElement)
      moduleOrder[el] = (Number(lastElement[0].module_order) + 1);
    }

    // add in the module to the modules table
    const queryStr = `INSERT INTO modules (module_name, video_link) VALUES (?,?)`;
    await db.query(queryStr, [moduleData.module_name, moduleData.video_link]);

    // if the module is intended for a track, add it to the track_module_match table
    if (intended_track.length) {
      for (let el of intended_track) {
      const moduleIdQuery = `SELECT module_id FROM modules WHERE module_name = ?`;
      const moduleId = await db.query(moduleIdQuery, [moduleData.module_name]);

      const matchTableQuery = `INSERT INTO track_module_match (track_id, module_id, module_order) VALUES (?, ?, ?)`;
      await db.query(matchTableQuery, [el, moduleId[0].module_id, moduleOrder[el]]);
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


// working on this
moduleController.updateModuleOrder = async (req, res, next) => {
  try{
    const items = req.body.items;
    // console.log('items',items)
    newOrder = {};
    for (let i = 0; i < items.length; i++) {
      const queryStr = `SELECT * from modules WHERE module_name = ?`;
      let result = await db.query(queryStr, [items[i]]);
      newOrder[i] = result[0].module_id;
    }

    // console.log('newOrder', newOrder)

    for (let key in newOrder) {
      let modOrder = key;
      let modId = newOrder[key];
      const queryStr2 = `UPDATE track_module_match SET module_order = ? WHERE module_id = ?`;
      const VALUES = [modOrder, modId];
      await db.query(queryStr2, VALUES);
    }

  } catch (err) {
    return next({
      log: 'moduleController.updateModuleOrder: ERROR: Invalid request',
      message: { err: 'moduleController.updateModuleOrder: ERROR: Check server logs for details' },
    });
  }
  return next();
};

module.exports = moduleController;
