
//used to get appointments for that specific day
export const getAppointmentsForDay = (state, day) => {
  const theDay = state.days.find(date => date.name === day);

  if (!theDay) {
    return [];
  }
  return theDay.appointments.map(appt => state.appointments[appt]);
}

//used to get interviewers
export const getInterviewersForDay = (state, day) => {
  const theDay = state.days.find(date => date.name === day);

  if (!theDay) {
    return [];
  }
  return theDay.interviewers.map(id => state.interviewers[id]);
}

//used to get the interview to be shown later
export const getInterview = (state, interview) => {
  if (interview === null) {
    return null;
  }

  return { ...interview, interviewer: state.interviewers[interview.interviewer] }
}

// function to count spots, then use that information to update spots
const countSpots = (state) => {
  const currentDay = state.days.find((day) => day.name === state.day) || [];
  const apptId = currentDay.appointments || [];

  const spots = apptId.filter((id) => !state.appointments[id].interview).length;

  return spots;
};

export const updateSpots = (state) => {
  const newCount = { ...state };
  const updatedDays = [...state.days];
  const updatedDay = { ...state.days.find((day) => day.name === state.day) };

  const spots = countSpots(state);
  updatedDay.spots = spots;

  const updatedDayIndex = state.days.findIndex((day) => day.name === state.day);
  updatedDays[updatedDayIndex] = updatedDay;

  newCount.days = updatedDays;

  return newCount;
};
