import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointment from "components/Appointment";
import DayList from "components/DayList";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = day => setState(prev => ({ ...prev, day }));
  const appointments = getAppointmentsForDay(state, state.day);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        appointments
      });
    })
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      setState({
        ...state,
        appointments
      });
    })
  }
  const genDayList = () => {
    return <DayList
      {... {
      days: state.days,
      value: state.day,
      onChange: setDay
      }} />
  }


  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={getInterviewersForDay(state, state.day)}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    })
  }, [])

  return { schedule, genDayList}
}