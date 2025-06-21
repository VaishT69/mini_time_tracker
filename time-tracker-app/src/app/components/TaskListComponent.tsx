'use client';

import { useTaskStore } from "../store/taskStore";

export default function TaskListComponent() {
  const { tasks, deleteTask } = useTaskStore();

  const totalHours = tasks.reduce((sum, t) => sum + t.hoursWorked, 0);

  return (
    <div className="mt-10 border-2 px-10 py-10">
      <h2 className="text-3xl font-bold mb-4 text-center">Tasks</h2>
      <ul className="space-y-6">
        {tasks.map((task, idx) => (
          <li
            key={idx}
            className="text-white p-4 px-10 border rounded shadow flex justify-between items-center"
          >
            <div>
              {task.taskName}: {task.hoursWorked} hours
            </div>
            <button
              onClick={() => deleteTask(idx)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-semibold">Total Hours: {totalHours}</p>
    </div>
  );
}
