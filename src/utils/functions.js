import { useRef, useEffect } from "react";

export const usePrevious = (value) => {
  const prevValueRef = useRef();

  useEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  return prevValueRef.current;
};

export const formatTime = (milliseconds) => {
  if (typeof milliseconds !== "number" || isNaN(milliseconds)) {
    throw new Error(
      "Invalid input. Please provide a valid number of milliseconds."
    );
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
};

export const generateRandomId = (length = 10) => {
  const characters =
    "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIdx = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIdx);
  }
  return randomId;
};
