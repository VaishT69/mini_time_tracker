"use client";

import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { z } from "zod";

const taskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  hoursWorked: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Hours must be a positive number",
    }),
});

export default function TaskListComponent() {
  // const { tasks, deleteTask, updateTask } = useTaskStore();
  const [updateIndex, setUpdateIndex] = useState<number | null>(null);
  const [updatedTaskName, setUpdatedTaskName] = useState("");
  const [updatedHours, setUpdatedHours] = useState("");
  const [errors, setErrors] = useState<{
    taskName?: string;
    hoursWorked?: string;
  }>({});

  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  const startUpdate = (index: number) => {
    setUpdateIndex(index);
    setUpdatedTaskName(tasks[index].taskName);
    setUpdatedHours(tasks[index].hoursWorked.toString());
  };

  const confirmUpdate = async () => {
    if (updateIndex === null) return;
    // await updateTask(updateIndex, {
    //   taskName: updatedTaskName,
    //   hoursWorked: parseFloat(updatedHours),
    // });
    const result = taskSchema.safeParse({
      taskName: updatedTaskName.trim(),
      hoursWorked: updatedHours,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        taskName: fieldErrors.taskName?.[0],
        hoursWorked: fieldErrors.hoursWorked?.[0],
      });
      return;
    }

    setErrors({});

    await updateTask(updateIndex, {
      taskName: result.data.taskName,
      hoursWorked: parseFloat(result.data.hoursWorked),
    });

    setUpdateIndex(null);
    setUpdatedHours("");
    setUpdatedTaskName("");
  };
  const hourChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setUpdatedHours(value);
      setErrors((prev) => ({ ...prev, hoursWorked: undefined }));
    }
  };

  const totalHours = tasks.reduce((sum, t) => sum + t.hoursWorked, 0);

  return (
    <div className="mt-10 border-2 lg:px-10 lg:py-10 md:px-20 md:py-20 px-6 py-6 bg-gray-900 rounded-xl">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-center">Tasks</h2>
        {/* <ul className="space-y-6">
          {tasks.map((task, idx) => (
            <li
              key={idx}
              className="hover:bg-gray-700 rounded-2xl text-white p-4 px-6 border shadow flex justify-between items-center"
            >
              <div>
                <span className="font-extrabold inline-block w-24 ">
                  {task.taskName}:
                </span>{" "}
                <span className="font-extrabold inline-block w-32 ">
                  {task.hoursWorked} hours
                </span>
              </div>
              <button
                onClick={() => deleteTask(idx)}
                className="bg-red-900 text-white px-3 py-1 rounded-xl"
              >
                Delete
              </button>
            </li>
          ))}
        </ul> */}
        <ul className="space-y-6">
          {tasks.map((task, idx) => (
            <li
              key={idx}
              className="hover:bg-gray-700 rounded-2xl text-white p-4 px-6 border shadow flex justify-center md:justify-between items-center"
            >
              {updateIndex === idx ? (
                <div className="flex  md:flex-row flex-col gap-2">
                  <input
                    type="text"
                    value={updatedTaskName}
                    onChange={(e) => {
                      setUpdatedTaskName(e.target.value);
                      setErrors((prev) => ({ ...prev, taskName: undefined }));
                    }}
                    className="border w-[18vh] px-2 py-1 rounded-2xl "
                  />
                    {errors.taskName && (
                      <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>
                    )}
                  <input
                    type="number"
                    value={updatedHours}
                      onChange={hourChangeUpdate}
                    className="border w-[18vh] px-2 py-1 rounded-2xl "
                  />
                   {errors.hoursWorked && (
                      <p className="text-red-500 text-sm mt-1">{errors.hoursWorked}</p>
                    )}
                  <div className="flex flex-row md:ml-20 lg:ml-35 mt-4 md:mt-0">
                    <button
                      onClick={confirmUpdate}
                      className="bg-cyan-800 text-white w-20 px-3 py-1 rounded-xl mr-2 "
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        deleteTask(idx);
                        setUpdateIndex(null);
                        setUpdatedTaskName("");
                        setUpdatedHours("");
                      }}
                      className="bg-red-900 text-white w-20 px-3 py-1 rounded-xl"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="">
                  <span className="font-extrabold inline-block w-24">
                    {" "}
                    {task.taskName}:
                  </span>{" "}
                  <span className="font-extrabold inline-block w-24">
                    {" "}
                    {task.hoursWorked} hours
                  </span>
                </div>
              )}
              <div className="flex gap-2">
                {updateIndex !== idx && (
                  <>
                    <button
                      onClick={() => startUpdate(idx)}
                      className="bg-cyan-800 text-white px-3 py-1 rounded-xl"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(idx)}
                      className="bg-red-900 text-white px-3 py-1 rounded-xl"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-10 font-semibold text-2xl">
        Total Hours:{" "}
        <span className="font-light text-blue-400"> {totalHours}</span>
      </p>
    </div>
  );
}

