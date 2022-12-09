import React from "react";

const Timer = ({ timerDays, timerHours, timerMinutes, timerSeconds }) => {
  return (
    <div>
      <span>{timerDays}</span>:<span>{timerHours}</span>:
      <span>{timerMinutes}</span>:<span>{timerSeconds}</span>
    </div>
  );
};
export default Timer;
