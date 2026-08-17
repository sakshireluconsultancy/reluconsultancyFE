import { useEffect, useState } from "react";

const CountdownTimerValue = ({ time }: { time: any }) => {
  const targetDate = time; // Set your target time here

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(targetDate));

  function getTimeRemaining(target: number) {
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, expired: false };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {timeLeft.expired ? (
        <h2>⏰ Countdown Finished!</h2>
      ) : (
        <div className=" flex gap-2 items-center justify-center mt-2 text-sm text-black font-semibold relative z-10 w-fit">
          <span className="h-15 p-2 bg-white rounded shadow-sm shadow-hpBlue text-shadow  border border-1  border-hpBlue">
            {timeLeft.days}D
          </span>
          <span className="h-15 p-2 bg-white rounded shadow-sm shadow-hpBlue text-shadow border border-1  border-hpBlue">
            {timeLeft.hours}h
          </span>
          <span className="h-15 p-2 bg-white rounded shadow-sm shadow-hpBlue text-shadow border border-1  border-hpBlue">
            {timeLeft.minutes}m
          </span>
          <span className="h-15 p-2 bg-white rounded shadow-sm shadow-hpBlue text-shadow border border-1  border-hpBlue">
            {timeLeft.seconds}s
          </span>
        </div>
      )}
    </div>
  );
};

export default CountdownTimerValue;
