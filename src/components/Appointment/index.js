import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import "./styles.scss"
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment({ interview, time, interviewers, bookInterview, id, cancelInterview }) {
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY)
  
  function save(name, interviewer) {
    console.log(name, interviewer)
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING);
    bookInterview(id, interview).then(() => {
      transition(SHOW)
    })
  }

  const deleteInterview = () => {
    transition(DELETING);
    cancelInterview(id)
    .then(() => {
      transition(EMPTY)
    });
  }

  const edit = () => {
    transition(EDIT)
  }

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
    </article>
  )
}