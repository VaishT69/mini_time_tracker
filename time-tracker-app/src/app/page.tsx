// import Image from "next/image";
import TaskFormComponent from "./components/TaskFormComponent";
import TaskListComponent from "./components/TaskListComponent";
import TaskTimercomponent from "./components/TaskTimeComponent";

export default function Home() {
  return (
    <div className="px-6 flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    
      <div className="w-full md:w-1/2 lg:w-1/3 max-w-2xl">
        <TaskFormComponent />
      </div>
      <div className="w-full md:w-1/2 lg:w-1/3 max-w-2xl">
        <TaskTimercomponent />
      </div>
      <div className="w-full max-w-3xl">
        <TaskListComponent />
      </div>
  
    </div>
  );
}
