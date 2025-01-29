 'use client'
 import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function PomodoroTimer() {
  const [time, setTime] = useState(25 * 60); // 25 minutes
  const [running, setRunning] = useState(false);
  const workerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof Worker !== "undefined") {
      workerRef.current = new Worker(new URL("../workers/timerWorker.js", import.meta.url));
      workerRef.current.onmessage = (e) => {
        if (e.data === "done") {
          setRunning(false);
          if (audioRef.current) {
            audioRef.current.play();
          }
        } else {
          setTime(e.data); // Update time from worker
        }
      };
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const startTimer = () => {
    workerRef.current?.postMessage("start");
    setRunning(true);
  };

  const stopTimer = () => {
    workerRef.current?.postMessage("stop");
    setRunning(false);
  };

  const resetTimer = () => {
    workerRef.current?.postMessage("reset");
    setTime(25 * 60);
    setRunning(false);
  };

  const addTime = (minutes) => {
    const newTime = time + minutes * 60; // Calculate the new time
    setTime(newTime); // Update the state with the new time
    workerRef.current?.postMessage({ action: "update", time: newTime }); // Send the updated time to the worker
  };

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">Pomodoro Timer</h1>
      <motion.div
        className="w-48 h-48 rounded-full border-8 border-red-500 flex items-center justify-center text-5xl font-semibold shadow-lg"
        animate={{ scale: running ? 1.2 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {minutes}:{seconds}
      </motion.div>
      <div className="mt-6 space-x-4 flex">
        {!running ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={startTimer}
            className="px-6 py-3 bg-green-500 rounded-lg text-lg font-medium shadow-md hover:bg-green-600 transition"
          >
            Start
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={stopTimer}
            className="px-6 py-3 bg-yellow-500 rounded-lg text-lg font-medium shadow-md hover:bg-yellow-600 transition"
          >
            Pause
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={resetTimer}
          className="px-6 py-3 bg-red-500 rounded-lg text-lg font-medium shadow-md hover:bg-red-600 transition"
        >
          Reset
        </motion.button>
      </div>
      <div className="mt-4 space-x-2 flex">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => addTime(5)} // Add 5 minutes
          className="px-4 py-2 bg-blue-500 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition"
        >
          +5 min
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => addTime(10)} // Add 10 minutes
          className="px-4 py-2 bg-blue-500 rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition"
        >
          +10 min
        </motion.button>
      </div>
      <audio ref={audioRef} src="/beep.mp3" preload="auto" />
    </div>
  );
}
