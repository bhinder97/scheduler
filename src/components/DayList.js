import React from "react";
import DayListItem from "./DayListItem";


export default function DayList(props) {
  const dayListItems = props.days.map((dayOfWeek) => {
    return (
      <DayListItem
      key={dayOfWeek.id}
      name={dayOfWeek.name}
      spots={dayOfWeek.spots}
      selected={dayOfWeek.name === props.value}
      setDay={props.onChange}
      />
    )
  })
  
  return (
    <ul>{dayListItems}</ul>
  )
}