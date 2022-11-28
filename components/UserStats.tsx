import { useEffect, useState } from "react";

let countDownTimeInterval: ReturnType<typeof setInterval>;

export default function UserStats() {
  const [countDownTimer, setCountDownTimer] = useState(30);
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
      <div>Time Remaining: {countDownTimer}</div>
    </>
  );
}
