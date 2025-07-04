"use client";

import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { z } from "zod";

export default function TaskFormComponent() {
  // const { addTask, fetchTasks } = useTaskStore();
  const addTask = useTaskStore((state) => state.addTask);
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

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  //   const addNewTask = async () => {
  //     if (!task || !hours) return;
  //     await addTask({ taskName: task, hoursWorked: parseFloat(hours) });
  //     setTask("");
  //     setHours("");
  //   };

  // const addNewTask = async () => {
  //   const result = taskSchema.safeParse({
  //     taskName: task,
  //     hoursWorked: parseFloat(hours),
  //   });
  //   if (!result.success) {
  //     const fieldErrors = result.error.flatten().fieldErrors;
  //     setEmptyField({
  //       name: fieldErrors.taskName?.[0],
  //       hours: fieldErrors.hoursWorked?.[0],
  //     });
  //     return;
  //   }

  //   await addTask(result.data);
  //   setTask("");
  //   setHours("");
  //   setEmptyField({});
  // };

  const addNewTask = () => {
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

    addTask(result.data);
    setTask("");
    setHours("");
    setEmptyField({});
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addNewTask();
  };

  return (
    <div className="mt-0 bg-gray-900">
      <div className="flex flex-col border-2 lg:py-20 lg:px-20 md:py-20 md:px-30 py-10 px-10 items-center gap-6 mt-0 rounded-xl">
        <h1 className="text-white font-bold text-center text-4xl mb-10">Enter Task</h1>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Task Name"
          className="p-2 border border-white w-60 rounded-xl"
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
          className="p-2 border border-white w-60 rounded-xl"
        />
        {emptyField.hours && (
          <p className="text-red-500 text-sm font-extrabold -mt-3">
            {emptyField.hours}
          </p>
        )}

        <button
          onClick={addNewTask}
          className="bg-white text-cyan-800 border-cyan-800 border-2 px-4 py-2 rounded-xl "
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
