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

const countSpots = (state) => {
  const currentDay = state.days.find((day) => day.name === state.day) || [];
  const appointmentIds = currentDay.appointments || [];

  const spots = appointmentIds.filter((id) => !state.appointments[id].interview).length;

  return spots;
};

export const updateSpots = (state) => {
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
