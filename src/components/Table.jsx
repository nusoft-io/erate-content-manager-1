import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Modal from '@mui/material/Modal';
import { useForm, useFieldArray, set } from "react-hook-form";

const TrackNames = {
  'man_sales': 'Manufacturer Sales',
  'man_mgmt': 'Manufacturer Management',
  'man_mrkt': 'Manufacturer Marketing',
  'sp_sales': 'Service Provider Sales',
  'sp_mgmt': 'Service Provider Management',
  'sp_opsinv': 'Service Provider Sales Operations and Inventory'
};

const trueFalse = {
  0: 'Wrong Answer',
  1: 'Correct Answer',
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '50%',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

// ------------------------  MAIN INNER FUNCTION (ROWS) ----------------------- //
function Row(props) {
  const { row, deleteModule, updateVideoLink}  = props;
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      answers: Array(2).fill({ answer: '', correct: false })
    }
  });
  const [initialAnswerCount, setInitialAnswerCount] = useState(2);

  // modal state variables //
  const [openModal, setOpenModal] = React.useState(false);
  const [answerAmount, setAnswerAmount] = useState(initialAnswerCount);
  const [questions, setQuestions] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  // modal functions //
  const handleOpen = () => {
    setOpenModal(true);
  }
  const handleClose = () => {
    setOpenModal(false);
    reset();
  }

  const { fields, append } = useFieldArray({
    control,
    name: "answers"
  });




// ------------------------  QUESTION FUNCTIONS ----------------------- //

  // ADD QUESTION W/ANSWERS TO DB //
  const addQuestion = (moduleId, answersData, questionData) => {
    console.log('module id', moduleId, 'question data', questionData, 'answers data', answersData);
    fetch('/api/addquestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ moduleId: moduleId, question: questionData, answers: answersData })
    })
    .then(response => response.json());
    handleClose();
  };
  
  // ADD QUESTION HELPER FUNC FOR CHECKBOX ANSWERS //
  const handleCheckboxChange = (index, value) => {
    fields[index].correct = value;
  };
  // ADD QUESTION HELPER FUNC FOR SUBMITTING QUESTION //
  const onSubmit = (data) => {
    const hasCorrectAnswer = data.answers.some(answer => answer.correct);

    if (!hasCorrectAnswer) {
      alert('Please select at least one correct answer.');
      return;
    }

    addQuestion(row.module_id, data.answers, data.question);
    reset({ answers: Array(2).fill({ answer: '', correct: false }) });
  };


  // GET QUESTIONS FROM DB FUNCTION //
  const getQuestions = (moduleId) => {
    console.log('looking for mod id here',moduleId);
    fetch('/api/getquestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ moduleId: moduleId })
    })
    .then(response => response.json())
    .then(data => setQuestions(data));
  }

  // DELETE QUESTIONS FROM DB FUNCTION //
  const deleteQuestions = (moduleId,questionId) => {
    console.log('looking for mod id here',moduleId);
    console.log('looking for question id here: ', questionId);
    fetch('/api/deletequestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ moduleId: moduleId, questionId: questionId})
    })
    .then(response => response.json())
    .then(data => {
      getQuestions(moduleId);
    });
  }

  // SHOW ANSWERS FOR QUESTION FUNCTION //
  const getAnswers = (questionId) => {
    fetch('/api/getanswers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ questionId: questionId })
    })
    .then(response => response.json())
    .then(data => setAnswers(data))
  }


// ------------------------  MODAL/DROPDOWN FUNCTIONS ----------------------- //
  const showQuestionModal = (moduleId) => {
    if (showQuestions) {
      setShowQuestions(false);
    } else {
      getQuestions(moduleId);
      setShowQuestions(true);
    }
  }

  const showAnswerModal = (questionId) => {
    if (showAnswers) {
      setShowAnswers(false);
    } else {
      getAnswers(questionId);
      setShowAnswers(true);
    }
  }

  const openDropdown = () => {
    if (open){
      setOpen(false);
      setShowQuestions(false);
    } else {
      setOpen(true);
    }
  }


  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => openDropdown()}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.module_name}
        </TableCell>
        <TableCell>
          <button onClick={() => { deleteModule(row.module_id) }}>Delete Module</button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div>Module Details</div>

              <div>
                <span>Video Details</span>
                {row.video_link ? (
                  <a href={row.video_link} target="_blank" rel="noopener noreferrer">
                    {row.video_link}
                  </a>
                ) : (
                  "No video link available"
                )}
                  <form onSubmit={handleSubmit((data) => {
                    updateVideoLink(row.module_id, data.video_link)
                    reset();
                    })}>
                  <input {...register('video_link')} placeholder='New Video Link' />
                  <input type="submit" />
                </form>
              </div>

              <div>
                <span>Track Details</span>
                {row.attachedTracks && row.attachedTracks.length > 0 ? (
                  row.attachedTracks.map((track, index) => (
                    <span key={index}>{TrackNames[track.track_name]}</span>
                  ))
                ) : (
                  "Not connected to any tracks"
                )}
              </div>
            </Box>

            <Box sx={{ margin: 1 }}>
                <div>
                  <div>Questions</div>

                  <div>
                    <button onClick={handleOpen}>Add Question</button>
                    <Modal
                      open={openModal}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={modalStyle}>
                        <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <input {...register("question")} placeholder="Question" />
                          {fields.map((item, index) => (
                            <div key={item.id}>
                              <input {...register(`answers.${index}.answer`)} placeholder={`Answer ${index + 1}`} />
                            </div>
                          ))}

                          <button type="button" onClick={() => {
                            append({ answer: "", correct: false });
                            setAnswerAmount(answerAmount + 1);
                            }}>
                            Add Answer
                          </button>
                          <fieldset>
                            <legend>
                              Select correct answer/s
                            </legend>
                            <div>
                            {fields.map((_, index) => (
                              <div key={index}>
                                <label htmlFor={`correct${index}`}>Answer {index + 1}</label>
                                <input 
                                  type="checkbox" 
                                  {...register(`answers.${index}.correct`)}
                                  onChange={(e) => handleCheckboxChange(index, e.target.checked)} 
                                />
                              </div>
                            ))}
                            </div>
                          </fieldset>
                          <input type="submit" />
                        </form>
                        </div>
                      </Box>
                    </Modal>
                  </div>

                  <button onClick={()=> {
                    showQuestionModal(row.module_id);
                    }
                  }>show questions</button>

                    {showQuestions ? <div>
                    {questions.map(question => {
                      console.log('question', question);
                      return (
                        <div key={question.question_id}>
                          <div>{question.question_text}</div>
                          <button onClick={()=> deleteQuestions(row.module_id, question.question_id)}>Delete Question</button>
                          <button onClick={()=> showAnswerModal(question.question_id)}>Show Answers</button>
                          {showAnswers ? 
                            <div>
                              {answers.map(answer => {
                                return (
                                  <div key={answer.answer_id}>
                                    <div>{answer.answer_text}</div>
                                    <div>{trueFalse[answer.is_correct]}</div>
                                  </div>
                                )
                              })}
                            </div> : null  
                          }
                        </div>
                      )
                    })}
                  </div> : null}
    
                  

                </div>
            </Box>
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
    fetch('/api/getallmodules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setAllModules(data));
  }

  function deleteModule(moduleId) {
    console.log(moduleId);
    const confirmation = window.confirm("Are you sure you want to delete this module?");
    if (confirmation) {
      fetch('/api/deletemodule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moduleId: moduleId })
      })
        .then(() => {
          setRefresh(true);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  function updateVideoLink(moduleId, videoLink){
    console.log(moduleId, videoLink);
    fetch('/api/updatevideolink',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ moduleId: moduleId, videoLink: videoLink })
    })
    .then(response => response.json())
    .then(data => {
      setRefresh(true);
    })
  };

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
            <Row key={module.module_id} row={module} deleteModule={deleteModule} updateVideoLink={updateVideoLink}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
