const db = require('../database.js')

const moduleController = {};

const trackMatcher = {
  'man_sales': 1,
  'man_mgmt': 2,
  'man_mrkt': 3,
  'sp_sales': 4,
  'sp_mgmt': 5,
  'sp_opsinv': 6,
}

const trackMatcherName = {
  1: 'man_sales',
  2: 'man_mgmt',
  3: 'man_mrkt',
  4: 'sp_sales',
  5: 'sp_mgmt',
  6: 'sp_opsinv',
}


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
      if (!lastElement.length) {
        moduleOrder[el] = 0;
      } else {
        console.log('last element', lastElement)
        moduleOrder[el] = (Number(lastElement[0].module_order) + 1);
      }
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
  try {
    const queryStr = `SELECT * FROM modules`;
    const allModules = await db.query(queryStr);
    let allNewModules = [];

    for (const module of allModules) {
      let AllModInfo = {
        module_id: module.module_id,
        module_name: module.module_name,
        video_link: module.video_link,
        attachedTracks: [],
      };

      const trackQuery = `SELECT track_id FROM track_module_match WHERE module_id = ?`;
      const moduleId = module.module_id;
      const attachedTracks = await db.query(trackQuery, [moduleId]);

      for (let el of attachedTracks) {
        AllModInfo.attachedTracks.push({'track_id': el.track_id, 'track_name': trackMatcherName[el.track_id]});
      }

      allNewModules.push(AllModInfo);
    }

    // console.log('allNewModules', allNewModules);
    res.locals.allModules = allNewModules;

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
    const trackId = trackMatcher[req.body.track];
    newOrder = {};
    for (let i = 0; i < items.length; i++) {
      newOrder[i] = items[i].modId;
    }

    console.log('newOrder', newOrder)

    for (let key in newOrder) {
      let modOrder = key;
      let modId = newOrder[key];
      const queryStr2 = `UPDATE track_module_match SET module_order = ? WHERE module_id = ? AND track_id = ?;`;
      const VALUES = [modOrder, modId, trackId];
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


moduleController.updateVideoLink = async (req, res, next) => {
  try {
    const moduleId = req.body.moduleId;
    const videoLink = req.body.videoLink;
    const queryStr = `UPDATE modules SET video_link = ? WHERE module_id = ?`;
    const VALUES = [videoLink, moduleId];
    await db.query(queryStr, VALUES);
    return next();
  } catch (err){
    return next({
      log: 'moduleController.updateVideoLink: ERROR: Invalid request',
      message: { err: 'moduleController.updateVideoLink: ERROR: Check server logs for details' },
    });
  }
};

moduleController.addQuestion = async (req, res, next) => {
  try {
    console.log(' in addquestion / req body',req.body)
    const moduleId = req.body.moduleId;
    const question = req.body.question;
    const answers = req.body.answers;

    const queryStr1 = `INSERT INTO questions (module_id, question_text) VALUES (?, ?)`;
    const VALUES1 = [moduleId, question];
    const questionId = await db.query(queryStr1, VALUES1);
    console.log('looking at questionId', questionId.insertId)

    const queryStr2 = `INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)`;
    for (let el of answers) {
      const VALUES2 = [questionId.insertId, el.answer, el.correct];
      await db.query(queryStr2, VALUES2);
    }
  } catch (err) {
    return next({
      log: 'moduleController.addQuestion: ERROR: Invalid request',
      message: { err: 'moduleController.addQuestion: ERROR: Check server logs for details' },
    })
  }
}


moduleController.getQuestions = async (req, res, next) => {
  try {
    const moduleId = req.body.moduleId;
    const queryStr = `SELECT * FROM questions WHERE module_id = ?`;
    const questions = await db.query(queryStr, [moduleId]);
    res.locals.questions = questions;
  } catch (err) {
    return next({
      log: 'moduleController.getQuestions: ERROR: Invalid request',
      message: { err: 'moduleController.getQuestions: ERROR: Check server logs for details' },
    })
  }
  return next();
}

moduleController.deleteQuestions = async (req, res, next) => {
  try {
    const questionId = req.body.questionId;
    const moduleId = req.body.moduleId;
    const queryStr = `DELETE FROM questions WHERE question_id = ? AND module_id = ?;`;
    await db.query(queryStr, [questionId, moduleId]);
    return next();
  } catch (err) {
    return next({
      log: 'moduleController.deleteQuestions: ERROR: Invalid request',
      message: { err: 'moduleController.deleteQuestions: ERROR: Check server logs for details' },
    })
  }
}


moduleController.getAnswers = async (req, res, next) => {
  try {
    const questionId = req.body.questionId;
    console.log('questionId in middleware',questionId)
    const queryStr = `SELECT * FROM answers WHERE question_id = ?`;
    const answers = await db.query(queryStr, [questionId]);
    console.log('answers in middleware',answers)
    res.locals.answers = answers;
  } catch (err) {
    return next({
      log: 'moduleController.getAnswers: ERROR: Invalid request',
      message: { err: 'moduleController.getAnswers: ERROR: Check server logs for details' },
    })
  }
  return next();
}

moduleController.addToTrack = async (req, res, next) => {
  try {
    const intended_track = req.body.formData.intended_track;
    const module_id = req.body.module_id;
    console.log('module_id', module_id)
    console.log('intended_track', intended_track)
    // DELETE CURR MODULE MATCHES
    const queryStr1 = `DELETE FROM track_module_match WHERE module_id = ?`;
    await db.query(queryStr1, [module_id]);

    // LOOP OVER EACH TRACK AND ADD TO TRACK_MODULE_MATCH IN CORRECT ORDER
    let moduleOrder = {};

    for (let el of intended_track) {
      const queryStr3 = `SELECT * FROM track_module_match WHERE track_id = ? ORDER BY module_order DESC LIMIT 1`;
  
      let lastElement = await db.query(queryStr3, [el]);
      if (!lastElement.length) {
        moduleOrder[el] = 0;
      } else {
        console.log('last element', lastElement)
        moduleOrder[el] = (Number(lastElement[0].module_order) + 1);
      }
  
      console.log('moduleOrder', moduleOrder)

    const matchTableQuery = `INSERT INTO track_module_match (track_id, module_id, module_order) VALUES (?, ?, ?)`;
    await db.query(matchTableQuery, [el, module_id, moduleOrder[el]]);
    }

  } catch (err) {
    return next({
      log: 'moduleController.addToTrack: ERROR: Invalid request',
      message: { err: 'moduleController.addToTrack: ERROR: Check server logs for details' },
    })
  }
}



module.exports = moduleController;
