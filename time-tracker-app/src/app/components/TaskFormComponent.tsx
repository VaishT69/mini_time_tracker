"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "../store/taskStore";
import { z } from "zod";

export default function TaskFormComponent() {
  const { addTask, fetchTasks } = useTaskStore();
  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");
  const [emptyField, setEmptyField] = useState<{
    name?: string;
    hours?: string;
  }>({});

  const taskSchema = z.object({
    taskName: z.string().min(1, "Task name is required"),
    hoursWorked: z
      .number({ invalid_type_error: "Enter a valid number" })
      .positive("Number of hours must be greater than zero"),
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  //   const addNewTask = async () => {
  //     if (!task || !hours) return;
  //     await addTask({ taskName: task, hoursWorked: parseFloat(hours) });
  //     setTask("");
  //     setHours("");
  //   };

  const addNewTask = async () => {
    const result = taskSchema.safeParse({
      taskName: task,
      hoursWorked: parseFloat(hours),
    });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setEmptyField({
        name: fieldErrors.taskName?.[0],
        hours: fieldErrors.hoursWorked?.[0],
      });
      return;
    }

    await addTask(result.data);
    setTask("");
    setHours("");
    setEmptyField({});
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addNewTask();
  };

  return (
    <div className="mt-0 bg-gray-900">
      <div className="flex flex-col border-2 lg:py-20 lg:px-20 md:py-20 md:px-30 py-10 px-10 items-center gap-6 mt-40">
        <h1 className="text-white text-center text-4xl mb-10">Time Tracker</h1>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Task Name"
          className="p-2 border-2 border-white w-60 rounded-2xl"
        />
        {emptyField.name && (
          <p className="text-red-500 text-sm font-extrabold -mt-3">
            {emptyField.name}
          </p>
        )}
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Hours Worked"
          className="p-2 border-2 border-white w-60 rounded-2xl"
        />
        {emptyField.hours && (
          <p className="text-red-500 text-sm font-extrabold -mt-3">
            {emptyField.hours}
          </p>
        )}

        <button
          onClick={addNewTask}
          className="bg-white text-blue-600 border-blue-400 border-2 px-4 py-2 rounded-xl "
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
