import { create } from "zustand";
import axios from "axios";

type Task = {
  taskName: string;
  hoursWorked: number;
};

type TaskStore = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  deleteTask: (index: number) => Promise<void>;
  updateTask: (index: number, updatedTask: Task) => Promise<void>;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  fetchTasks: async () => {
    const res = await axios.get("/api/tasks");
    set({ tasks: res.data });
  },

  addTask: async (task) => {
    await axios.post("/api/tasks", task);
    const res = await axios.get("/api/tasks");
    set({ tasks: res.data });
  },

  deleteTask: async (index) => {
    await axios.delete("/api/tasks", { data: { index } });
    const res = await axios.get("/api/tasks");
    set({ tasks: res.data });
  },
  updateTask: async (index, updatedTask) => {
    await axios.put("/api/tasks", { index, ...updatedTask });
    const res = await axios.get("/api/tasks");
    set({ tasks: res.data });
  },
}));
