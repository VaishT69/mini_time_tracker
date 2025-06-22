import { create } from "zustand";
// import axios from "axios";
import { persist } from "zustand/middleware";

type Task = {
  taskName: string;
  hoursWorked: number;
};

// type TaskStore = {
//   tasks: Task[];
//   fetchTasks: () => Promise<void>;
//   addTask: (task: Task) => Promise<void>;
//   deleteTask: (index: number) => Promise<void>;
//   updateTask: (index: number, updatedTask: Task) => Promise<void>;
// };

type TaskStore = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (index: number) => void;
  updateTask: (index: number, updatedTask: Task) => void;
  clearTasks: () => void;
};

// export const useTaskStore = create<TaskStore>((set) => ({
//   tasks: [],

//   fetchTasks: async () => {
//     const res = await axios.get("/api/tasks");
//     set({ tasks: res.data });
//   },

//   addTask: async (task) => {
//     await axios.post("/api/tasks", task);
//     const res = await axios.get("/api/tasks");
//     set({ tasks: res.data });
//   },

//   deleteTask: async (index) => {
//     await axios.delete("/api/tasks", { data: { index } });
//     const res = await axios.get("/api/tasks");
//     set({ tasks: res.data });
//   },
//   updateTask: async (index, updatedTask) => {
//     await axios.put("/api/tasks", { index, ...updatedTask });
//     const res = await axios.get("/api/tasks");
//     set({ tasks: res.data });
//   },
// }));

export const useTaskStore = create<TaskStore>() (
  persist(
    (set) => ({
      tasks: [],

      addTask: (task) => 
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
        
      deleteTask: (index) => 
        set((state) => ({
          tasks: state.tasks.filter((_,i) => i !== index),
        })),  
      
        updateTask: (index, updatedTask) => 
          set((state) => {
            const updatedTasks = [...state.tasks];
            updatedTasks[index] = updatedTask;
            return { tasks: updatedTasks};
          }),

          clearTasks: () => set({ tasks: []}),
    }),
    {
      name: "task-store",
    }
  )
);