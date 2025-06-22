"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useTaskStore } from "../store/taskStore";

const taskSchema = z.object({
  taskName: z.string().min(1, "Task name cannot be empty"),
});
export default function TaskTimercomponent() {
  const addNewTask = useTaskStore((state) => state.addTask);
  const [timing, setTimer] = useState(false);
  const [start, setStart] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timing && start) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - start);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timing, start]);

  const startTimer = () => {
    const validation = taskSchema.safeParse({ taskName: task.trim() });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setError("");
    setStart(Date.now());
    setTimer(true);
    setElapsedTime(0);
  };

  const stopTimer = async () => {
    if (!start) return;

    const durationInHours = (Date.now() - start) / (1000 * 60 * 60);

    await addNewTask({
      taskName: task.trim(),
      hoursWorked: parseFloat(durationInHours.toFixed(4)),
    });

    setTimer(false);
    setStart(null);
    setElapsedTime(0);
    setTask("");
  };

  const formatTime = (millisecond: number) => {
    const totalSeconds = Math.floor(millisecond / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="mt-10 bg-gray-900 p-6 rounded-xl flex flex-col items-center gap-4 border-2">
      <h2 className="text-white text-2xl font-bold">
        Enter Task To Start Timer
      </h2>

      <input
        type="text"
        placeholder="Enter Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className={`border px-4 py-2 rounded-xl w-68 ${
          error ? "border-red-500" : "border-white"
        }`}
        disabled={timing}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="text-white text-xl">
        {timing ? `Elapsed: ${formatTime(elapsedTime)}` : "Not timing"}
      </div>

      {!timing ? (
        <button
          onClick={startTimer}
          className="bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          Start Timer
        </button>
      ) : (
        <button
          onClick={stopTimer}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Stop Timer
        </button>
      )}
    </div>
  );
}

