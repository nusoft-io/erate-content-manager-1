const express = require("express");
const trackController = require("./Controllers/trackController.js");
const moduleController = require("./Controllers/moduleController.js");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ---------------- //
app.post(
  "/api/gettrackmodules",
  trackController.getTrackModules,
  (req, res) => {
    res.status(200).json(res.locals.trackModules);
  }
);

app.post("/api/addmodule", moduleController.addModule, (req, res) => {
  res.status(200).send("Module added successfully");
});

app.get("/api/getallmodules", moduleController.getAllModules, (req, res) => {
  res.status(200).json(res.locals.allModules);
});

app.post("/api/deletemodule", moduleController.deleteModule, (req, res) => {
  res.status(200).send("Module deleted successfully");
});

app.post(
  "/api/updateModuleOrder",
  moduleController.updateModuleOrder,
  (req, res) => {
    res.status(200).send({ message: "Order updated successfully" });
  }
);

app.post(
  "/api/removetrackmodule",
  trackController.removeTrackModule,
  (req, res) => {
    res.status(200).json(res.locals.removed);
  }
);

app.post(
  "/api/updatevideolink",
  moduleController.updateVideoLink,
  (req, res) => {
    res.status(200).send({ message: "Video Link Updated Successfully" });
  }
);

app.post("/api/updateaskcount", moduleController.updateAskCount, (req, res) => {
  res.status(200).send({ message: "Ask Count Updated Successfully" });
});

app.post("/api/addquestion", moduleController.addQuestion, (req, res) => {
  res.status(200).send({ message: "Question Added Successfully" });
});

app.post("/api/getquestions", moduleController.getQuestions, (req, res) => {
  res.status(200).json(res.locals.questions);
});

app.post(
  "/api/deletequestions",
  moduleController.deleteQuestions,
  (req, res) => {
    res.status(200).send({ message: "Questions Deleted Successfully" });
  }
);

app.post("/api/getanswers", moduleController.getAnswers, (req, res) => {
  res.status(200).json(res.locals.answers);
});

app.post("/api/addtotrack", moduleController.addToTrack, (req, res) => {
  res.status(200).send({ message: "Module added to track successfully" });
});

// GLOBAL ERROR HANDLER //
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log("Server error occured: ", errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
