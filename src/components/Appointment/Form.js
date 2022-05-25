import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";



export default function Form(props) {
  const [student, setStudent] = useState(props.student || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState(false);

  //resets the card
  const reset = function() {
    setStudent("")
    setInterviewer(null)
  }

  //cancels and resets the card
  const cancel = function() {
    reset()
    props.onCancel()
  }

  const validate = () => {
    if (!student) {
      setError("Please enter a name.");
      return
    } else if (!interviewer) {
      setError("Please enter an interviewer.");
      return
    } else {
      setError(false)
      return props.onSave(student, interviewer);
    }
  };
  
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={student}
            onChange={(event) => setStudent(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        {error && (
          <section className="appointment__validation">{error}</section>
        )}
        <InterviewerList
          value={interviewer}
          interviewers={props.interviewers}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel} >Cancel</Button>
          <Button confirm onClick={() => validate()} >Save</Button>
        </section>
      </section>
    </main>
  )
}