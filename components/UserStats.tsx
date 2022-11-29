import { useEffect, useState } from "react";

let countDownTimeInterval: ReturnType<typeof setInterval>;

export default function UserStats() {
  const [countDownTimer, setCountDownTimer] = useState(30);
  /*
  1. We’re using the setInterval function to set a timer that will count down from the initial value of countDownTimer.
  2. We’re using the setCountDownTimer function to set the countDownTimer value.
  3. We’re using the clearInterval function to clear the interval when the component unmounts.
  */
  useEffect(() => {
    countDownTimeInterval = setInterval(() => {
      if (countDownTimer > 0) {
        setCountDownTimer((pre: number) => pre - 1);
      }
    }, 1000);
    return () => {
      clearInterval(countDownTimeInterval);
    };
  }, []);
  return (
    <>
      <div>Time Remaining: {(countDownTimer>0)?countDownTimer:''}</div>
    </>
  );
}
