export const getAppointmentsForDay = (state, day) => {
  const theDay = state.days.find(date => date.name === day);

  if (!theDay) {
    return [];
  }
  return theDay.appointments.map(appt => state.appointments[appt]);
}

export const getInterviewersForDay = (state, day) => {
  const theDay = state.days.find(date => date.name === day);

  if (!theDay) {
    return [];
  }
  return theDay.interviewers.map(id => state.interviewers[id]);
}

export const getInterview = (state, interview) => {
  if (interview === null) {
    return null;
  }

  return { ...interview, interviewer: state.interviewers[interview.interviewer] }
}