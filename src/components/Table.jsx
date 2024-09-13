import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Modal from "@mui/material/Modal";
import { useForm, useFieldArray, set, get } from "react-hook-form";
import "../styles/Table.scss";
import { Spa } from "@mui/icons-material";

const TrackNames = {
  man_sales: "Manufacturer Sales",
  man_mgmt: "Manufacturer Management",
  man_mrkt: "Manufacturer Marketing",
  sp_sales: "Service Provider Sales",
  sp_mgmt: "Service Provider Management",
  sp_opsinv: "Service Provider Sales Operations and Inventory",
};

const TrackIds = {
  1: "Manufacturer Sales",
  2: "Manufacturer Management",
  3: "Manufacturer Marketing",
  4: "Service Provider Sales",
  5: "Service Provider Management",
  6: "Service Provider Sales Operations and Inventory",
};

const trueFalse = {
  0: "Wrong Answer",
  1: "Correct Answer",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "50%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

// ------------------------  MAIN INNER FUNCTION (ROWS) ----------------------- //
function Row(props) {
  const { row, deleteModule, updateVideoLink, updateAskCount } = props;
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      answers: Array(2).fill({ answer: "", correct: false }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const [initialAnswerCount, setInitialAnswerCount] = useState(2);

  // modal state variables //
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalTrack, setOpenModalTrack] = React.useState(false);
  const [answerAmount, setAnswerAmount] = useState(initialAnswerCount);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});
  const [currModTracks, setCurrModTracks] = useState([]);
  const [currModQuestions, setCurrModQuestions] = useState([]);

  // modal functions //
  const handleOpen = (data) => {
    // console.log("data looking here", data);
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
    reset();
  };

  // TRACK DETAILS MODAL FUNCTIONS //

  const handleOpenTrack = (data) => {
    setCurrModTracks(data);
    setOpenModalTrack(true);
  };

  const handleCloseTrack = () => {
    setOpenModalTrack(false);
    reset();
  };

  // ------------------------  QUESTION FUNCTIONS ----------------------- //

  // ADD QUESTION W/ANSWERS TO DB //
  const addQuestion = (moduleId, answersData, questionData) => {
    // console.log(
    //   "module id",
    //   moduleId,
    //   "question data",
    //   questionData,
    //   "answers data",
    //   answersData
    // );
    fetch("/api/addquestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moduleId: moduleId,
        question: questionData,
        answers: answersData,
      }),
    }).then((response) => response.json());

    getQuestions(moduleId);
    handleClose();
  };

  // ADD QUESTION HELPER FUNC FOR CHECKBOX ANSWERS //
  const handleCheckboxChange = (index, value) => {
    fields[index].correct = value;
  };

  // ADD QUESTION HELPER FUNC FOR SUBMITTING QUESTION //
  const onSubmit = (data) => {
    const hasCorrectAnswer = data.answers.some((answer) => answer.correct);

    if (!hasCorrectAnswer) {
      alert("Please select at least one correct answer.");
      return;
    }

    addQuestion(row.module_id, data.answers, data.question);
    reset({ answers: Array(2).fill({ answer: "", correct: false }) });
  };

  // TRACK ADD/EDIT SUBMIT FUNCTION //
  const onSubmitTrack = (data) => {
    // console.log("from track form", data);
    // console.log("mod name", row.module_name);
    // console.log("mod id", row.module_id);

    const formData = data;
    const module_id = row.module_id;

    fetch("/api/addtotrack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ module_id, formData }),
    });

    let newModTracks = [];
    data.intended_track.forEach((track) => {
      newModTracks.push({ track_name: TrackIds[track] });
    });
    console.log("new mod tracks", newModTracks);
    setCurrModTracks(newModTracks);
    reset({ intended_track: [] });
    handleCloseTrack();
  };

  // GET QUESTIONS FROM DB FUNCTION //
  const getQuestions = (moduleId) => {
    // console.log("looking for mod id here", moduleId);
    fetch("/api/getquestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: moduleId }),
    })
      .then((response) => response.json())
      .then((data) => setQuestions(data));
  };

  // DELETE QUESTIONS FROM DB FUNCTION //
  const deleteQuestions = (moduleId, questionId) => {
    console.log("looking for mod id here", moduleId);
    console.log("looking for question id here: ", questionId);
    fetch("/api/deletequestions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: moduleId, questionId: questionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        getQuestions(moduleId);
      });
  };

  // SHOW ANSWERS FOR QUESTION FUNCTION //
  const getAnswers = (questionId) => {
    fetch("/api/getanswers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId: questionId }),
    })
      .then((response) => response.json())
      .then((data) => setAnswers(data));
  };

  // ------------------------  MODAL/DROPDOWN FUNCTIONS ----------------------- //
  const showQuestionModal = (moduleId) => {
    if (showQuestions) {
      setShowQuestions(false);
    } else {
      getQuestions(moduleId);
      setShowQuestions(true);
      // console.log("questions", questions);
    }
  };

  // const showAnswerModal = (questionId) => {
  //   if (showAnswers) {
  //     setShowAnswers(false);
  //   } else {
  //     getAnswers(questionId);
  //     setShowAnswers(true);
  //   }
  // }

  const showAnswerModal = (questionId) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
    if (!showAnswers[questionId]) {
      getAnswers(questionId);
    }
  };

  const openDropdown = async (data) => {
    if (open) {
      setOpen(false);
      setShowQuestions(false);
    } else {
      setOpen(true);
      console.log("data looking hereeee", data);
      setCurrModTracks(data.attachedTracks);
      await getQuestions(data.module_id);
      // console.log('questions', questions);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => openDropdown(row)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.module_name}
        </TableCell>
        <TableCell>
          <button
            className="erate-btn delete-mod-btn"
            onClick={() => {
              deleteModule(row.module_id);
            }}
          >
            Delete Module
          </button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          colSpan={6}
        >
          <Collapse
            in={open}
            timeout="auto"
            style={{ paddingBottom: 0, paddingTop: 0 }}
          >
            <div className="open-details-master-container">
              <Box sx={{ margin: 0 }}>
                <div className="vid-details-container">
                  <div className="box-detail-title">
                    {" "}
                    <span className="box-detail-title-text">Video Details</span>
                  </div>
                  {row.video_link ? (
                    <>
                      <div>
                        Current Module Video Link:
                        <a
                          className="vid-detail-link"
                          href={row.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.video_link}
                        </a>
                      </div>
                    </>
                  ) : (
                    "No video link available"
                  )}
                  <form
                    onSubmit={handleSubmit((data) => {
                      updateVideoLink(row.module_id, data.video_link);
                      reset();
                    })}
                  >
                    <input
                      className="new-vid-link-input"
                      {...register("video_link")}
                      placeholder="New Video Link"
                    />
                    <input className="new-vid-link-submit" type="submit" />
                  </form>
                </div>

                <div className="track-details-container">
                  <div className="box-detail-title">
                    {" "}
                    <span className="box-detail-title-text">Track Details</span>
                  </div>

                  {currModTracks.length > 0
                    ? currModTracks.map((track, index) => (
                        <span key={index}>
                          {TrackNames[track.track_name]
                            ? TrackNames[track.track_name]
                            : track.track_name}
                        </span>
                      ))
                    : "Not connected to any tracks"}
                </div>
                <button className="addedit-track-btn" onClick={handleOpenTrack}>
                  Add/Edit Tracks
                </button>
                <Modal
                  open={openModalTrack}
                  onClose={handleCloseTrack}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={modalStyle}>
                    <div>
                      <div className="curr-track-modal-details">
                        {row.attachedTracks && row.attachedTracks.length > 0 ? (
                          <>
                            <div className="attached-tracks-modal-title">
                              Current Attached Tracks:{" "}
                            </div>
                            <div className="attached-tracks-track-container">
                              {row.attachedTracks.map((track, index) => (
                                <span key={index}>
                                  {TrackNames[track.track_name]}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          "Not connected to any tracks"
                        )}
                      </div>

                      <form onSubmit={handleSubmit(onSubmitTrack)}>
                        <fieldset>
                          <legend>
                            Select All Tracks You Want To Attach Module To
                            (Including Current Tracks)
                          </legend>
                          <div className="track-options-container">
                            <label htmlFor="option1">
                              <input
                                type="checkbox"
                                id="option1"
                                value="1"
                                {...register("intended_track")}
                              />
                              Manufacturer Sales
                            </label>
                            <label htmlFor="option2">
                              <input
                                type="checkbox"
                                id="option2"
                                value="2"
                                {...register("intended_track")}
                              />
                              Manufacturer Managment
                            </label>
                            <label htmlFor="option3">
                              <input
                                type="checkbox"
                                id="option3"
                                value="3"
                                {...register("intended_track")}
                              />
                              Manufacture Marketing
                            </label>
                            <label htmlFor="option4">
                              <input
                                type="checkbox"
                                id="option4"
                                value="4"
                                {...register("intended_track")}
                              />
                              Service Provider Sales
                            </label>
                            <label htmlFor="option5">
                              <input
                                type="checkbox"
                                id="option5"
                                value="5"
                                {...register("intended_track")}
                              />
                              Service Provider Management
                            </label>
                            <label htmlFor="option6">
                              <input
                                type="checkbox"
                                id="option6"
                                value="6"
                                {...register("intended_track")}
                              />
                              Service Provider Sales Operations/Invoicing
                            </label>
                          </div>
                        </fieldset>
                        <input type="submit" />
                      </form>
                    </div>
                  </Box>
                </Modal>
              </Box>

              <Box></Box>

              <Box sx={{ margin: 0 }}>
                <div>
                  <div className="question-details-container">
                    <div className="box-detail-title">
                      {" "}
                      <span className="box-detail-title-text">
                        Question Details
                      </span>
                    </div>

                    <div className="ask-count-master-container">
                      <div className="ask-count-container">
                        <div>Total # of Questions: </div>
                        <div className="ask-count">{questions.length}</div>
                      </div>
                      <div className="ask-count-container">
                        <div>Num of questions currently being asked:</div>
                        <div className="ask-count">
                          {row.ask_count >= questions.length
                            ? "All Questions"
                            : row.ask_count}
                        </div>
                      </div>
                      {/* <div>Change number of asked questions</div> */}
                      <form
                        onSubmit={handleSubmit((data) => {
                          updateAskCount(row.module_id, data.ask_count);
                          reset();
                        })}
                      >
                        <input
                          className="new-vid-link-input"
                          {...register("ask_count")}
                          placeholder="new # of questions"
                        />
                        <input className="new-ask-count-submit" type="submit" />
                      </form>
                    </div>

                    <div className="question-inner-container">
                      <button className="add-question-btn" onClick={handleOpen}>
                        Add Question
                      </button>
                      <Modal
                        open={openModal}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="question-modal-container"
                      >
                        <Box sx={{ ...modalStyle, overflow: "auto" }}>
                          <div className="add-question-master-modal">
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <fieldset>
                                <legend>Input Question & Answers</legend>
                                {/* <input className='question-input' {...register("question")} placeholder="Question" /> */}
                                <div className="enter-question-text">
                                  Enter Question:
                                </div>
                                <textarea
                                  className="question-input"
                                  {...register("question")}
                                  placeholder="Question"
                                  rows="3"
                                  style={{
                                    width: "100%",
                                    height: "30px",
                                    fontFamily: "Arial",
                                    fontSize: "14px",
                                    resize: "vertical",
                                  }}
                                ></textarea>
                                <div className="enter-answers-title-container">
                                  <div className="enter-answers-text">
                                    Enter Answers:
                                  </div>
                                  <button
                                    className="add-answer-btn"
                                    type="button"
                                    onClick={() => {
                                      append({ answer: "", correct: false });
                                      setAnswerAmount(answerAmount + 1);
                                    }}
                                  >
                                    Add Answer
                                  </button>
                                </div>
                                {fields.map((item, index) => (
                                  <div key={item.id}>
                                    <input
                                      className="answer-input"
                                      {...register(`answers.${index}.answer`)}
                                      placeholder={`Answer ${index + 1}`}
                                    />
                                    <button
                                      className="answer-remove-btn"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </fieldset>

                              <fieldset>
                                <legend>Select correct answer/s</legend>
                                <div>
                                  {fields.map((_, index) => (
                                    <div key={index}>
                                      <label htmlFor={`correct${index}`}>
                                        Answer {index + 1}
                                      </label>
                                      <input
                                        type="checkbox"
                                        {...register(
                                          `answers.${index}.correct`
                                        )}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            index,
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              </fieldset>
                              <div className="submit-btn-modal-container">
                                <input
                                  className="add-question-formsubmit-btn"
                                  type="submit"
                                />
                              </div>
                            </form>
                          </div>
                        </Box>
                      </Modal>

                      <button
                        className="show-question-btn"
                        onClick={() => {
                          showQuestionModal(row.module_id);
                        }}
                      >
                        Show Questions
                      </button>

                      {showQuestions ? (
                        questions.length > 0 ? (
                          <div>
                            <ol>
                              {questions.map((question) => (
                                <li
                                  className="question-item"
                                  key={question.question_id}
                                >
                                  <div className="question-text">
                                    {question.question_text}
                                  </div>
                                  <div className="question-btn-container">
                                    <button
                                      className="show-answer-btn"
                                      onClick={() =>
                                        showAnswerModal(question.question_id)
                                      }
                                    >
                                      Show Answers
                                    </button>
                                    <button
                                      className="delete-answer-btn"
                                      onClick={() =>
                                        deleteQuestions(
                                          row.module_id,
                                          question.question_id
                                        )
                                      }
                                    >
                                      Delete Question
                                    </button>
                                  </div>
                                  {showAnswers[question.question_id] && (
                                    <ul>
                                      {answers.map((answer) => (
                                        <li
                                          className="solo-answer-container"
                                          key={answer.answer_id}
                                        >
                                          <div>
                                            <div className="answer-text">
                                              {answer.answer_text}
                                            </div>
                                            <div className="answer-correct-text">
                                              {trueFalse[answer.is_correct]}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ))}
                            </ol>
                          </div>
                        ) : (
                          <div>No questions available</div>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

// ------------------------  MAIN OUTTER FUNCTION (TABLE) ----------------------- //
export default function ModulesTable() {
  const [allModules, setAllModules] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchAllModules();
    setRefresh(false);
  }, [refresh]);

  function fetchAllModules() {
    fetch("/api/getallmodules", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setAllModules(data));
  }

  function deleteModule(moduleId) {
    console.log(moduleId);
    const confirmation = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (confirmation) {
      fetch("/api/deletemodule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId: moduleId }),
      })
        .then(() => {
          setRefresh(true);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function updateVideoLink(moduleId, videoLink) {
    // console.log(moduleId, videoLink);
    fetch("/api/updatevideolink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: moduleId, videoLink: videoLink }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRefresh(true);
      });
  }

  function updateAskCount(moduleId, askCount) {
    fetch("/api/updateaskcount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ moduleId: moduleId, ask_count: askCount }),
    })
      .then((response) => response.json())
      .then((data) => {
        setRefresh(true);
      });
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Module Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allModules.map((module) => (
            <Row
              key={module.module_id}
              row={module}
              deleteModule={deleteModule}
              updateVideoLink={updateVideoLink}
              updateAskCount={updateAskCount}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
