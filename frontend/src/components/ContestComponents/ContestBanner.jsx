import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ContestBanner = ({ startDate, endDate }) => {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const { currentContestName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function getRemainingTime() {
    const now = new Date().getTime();
    const targetDate = new Date(startDate - 19800000).getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Test start date has passed
      navigate(`/pretest/${currentContestName}`);
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }

  return (
    <div className="text-4xl w-full flex font-mono">
      <h2 className="absolute text-white flex justify-center place-items-center w-full top-20 text-4xl lg:text-6xl font-bold">
        {window.innerWidth < 1000 ? (
          <span className="text-white">Contest Has Not Started</span>
        ) : (
          <>
            <span className="text-sky-100">Contest Has N</span>
            <span className="text-sky-100 w-[17.5px] overflow-hidden">o</span>
            <span className="text-green-500 w-[17.5px] overflow-hidden rotate-180">
              o
            </span>
            <span className="text-green-400">t Started Yet</span>
          </>
        )}
      </h2>

      <div className="flex w-1/2 h-screen justify-evenly place-items-center bg-green-600 text-white">
        <div className="flex justify-evenly w-full font-mono">
          <div className="flex flex-col place-items-center justify-center text-4xl font-semibold tracking-widest gap-y-4">
            <p className="border-b">Start Date</p>
            <p>
              {new Date(startDate - 19800000).toLocaleString().slice(0, 10)}
            </p>
            <p>{new Date(startDate).toUTCString().slice(17, 22)}</p>
          </div>
          <div className="flex flex-col place-items-center justify-center text-4xl font-semibold tracking-widest gap-y-4">
            <p className="border-b">End Date</p>
            <p>{new Date(endDate - 19800000).toLocaleString().slice(0, 10)}</p>
            <p>{new Date(endDate).toUTCString().slice(17, 22)}</p>
          </div>
        </div>
      </div>
      <div className="flex h-screen items-center w-1/2 bg-black text-white place-items-center">
        {/* Content for the second half of the banner */}
        <div className="mt-4 w-full">
          <div className="w-2/3 flex flex-col mt-2 mx-auto">
            <h3 className="text-5xl font-bold">Countdown Timer</h3>
            <div className="my-10 w-2/3 mx-auto flex flex-col place-items-baseline">
              <div className="mr-4">
                <span className="text-4xl font-bold">{remainingTime.days}</span>
                <span className="text-gray-400"> Days</span>
              </div>
              <div className="mr-4">
                <span className="text-4xl font-bold">
                  {remainingTime.hours}
                </span>
                <span className="text-gray-400"> Hours</span>
              </div>
              <div className="mr-4">
                <span className="text-4xl font-bold">
                  {remainingTime.minutes}
                </span>
                <span className="text-gray-400"> Minutes</span>
              </div>
              <div>
                <span className="text-4xl font-bold">
                  {remainingTime.seconds}
                </span>
                <span className="text-gray-400"> Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestBanner;
