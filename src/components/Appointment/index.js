import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import "./styles.scss"
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment({ interview, time, interviewers, bookInterview, id }) {
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
  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && <Show {...interview} />}
      {mode === CREATE && <Form {...interview} interviewers={interviewers} onCancel={() => back()} onSave={save}/>}
      {mode === SAVING && <Status message={"Saving..."} />}
    </article>
  )
}