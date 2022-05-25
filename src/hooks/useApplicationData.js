import React, { useState, useEffect } from "react";
import axios from "axios";
import Appointment from "components/Appointment";
import DayList from "components/DayList";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const countSpots = (state) => {
    console.log("THIS IS", state)
    const currentDay = state.days.find((day) => day.name === state.day) || [];
    const appointmentIds = currentDay.appointments || [];
  
    const spots = appointmentIds.filter((id) => !state.appointments[id].interview).length;
  
    return spots;
  };
  
  const updateSpots = (state) => {
    const updatedState = { ...state };
    const updatedDays = [...state.days];
    const updatedDay = { ...state.days.find((day) => day.name === state.day) };
  
    const spots = countSpots(state);
    updatedDay.spots = spots;
  
    const updatedDayIndex = state.days.findIndex((day) => day.name === state.day);
    updatedDays[updatedDayIndex] = updatedDay;
  
    updatedState.days = updatedDays;
  
    return updatedState;
  };

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
    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() => {
      setState(prev => ({ ...prev, appointments}))
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
      setState(prev => ({...prev, appointments}))
    })
  }

  const genDayList = () => {
    return <DayList
      days={state.days}
      value={state.day}
      onChange={setDay}/>
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

  useEffect(() => {
    setState(prev => updateSpots(prev));
  }, [state.appointments]);
  

  return { schedule, genDayList}
}