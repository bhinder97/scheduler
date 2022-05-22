export const getAppointmentsForDay = (state, day) => {
  const theDay = state.days.find(date => date.name === day);

  if (!theDay) {
    return [];
  }

  return theDay.appointments
    .map(appt => state.appointments[appt]);
}

// export const getInterviewersForDay = (state, day) => {
//   const { interviewers } = state
//   const dailyInterviewers = {};

//   getAppointmentsForDay(state, day)
//     .filter(appt => appt.interview)
//     .map(appt => appt.interview.interviewer)
//     .forEach(interviewer => {
//       dailyInterviewers[interviewer] = interviewers[interviewer]
//     });

//   return Object.values(dailyInterviewers);
// }

// export const getInterview = (state, interview) => {
//   if (interview === null) {
//     return null;
//   }

//   return { ...interview, interviewer: state.interviewers[interview.interviewer] }
// }