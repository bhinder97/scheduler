import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import "./styles.scss"
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

//all modes being used
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment({ interview, time, interviewers, bookInterview, id, cancelInterview }) {
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY)
  
  //save function
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING);
    bookInterview(id, interview)
    .then(() => {transition(SHOW, true)})
    .catch(() => {transition(ERROR_SAVE, true)});
  }

  //function used to delete the interview
  const deleteInterview = () => {
    transition(DELETING, true);
    cancelInterview(id)
    .then(() => transition(EMPTY, true))
    .catch(err => {
      transition(ERROR_DELETE, true)
      console.log(err)});
  }

  //function used to edit
  const edit = () => {
    transition(EDIT)
  }

  //all the states and modes being called and used depending on whether you want to save delete etc
  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show {...interview} onEdit={edit} onDelete={() => transition(CONFIRM)} />}
      {mode === CREATE && <Form {...interview} interviewers={interviewers} onCancel={() => back()} onSave={save}/>}
      {mode === EDIT && <Form { ...interview} interviewers={interviewers} onCancel={back} onSave={save} />}
      {mode === SAVING && <Status message={"Saving..."} />}
      {mode === DELETING && <Status message={"Deleting ..."} /> }
      {mode === CONFIRM && <Confirm message={"Are you sure you would like to delete?"} onCancel={back} onConfirm={deleteInterview} />}
      {mode === ERROR_SAVE && <Error message={"Error attempting to save"} onClose={back} /> }
      {mode === ERROR_DELETE && <Error message={"Error attempting to delete"} onClose={back} />}
    </article>
  )
}