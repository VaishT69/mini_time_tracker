import type { NextApiRequest, NextApiResponse } from "next";
// import { success } from "zod/v4";

const tasks: { taskName: string; hoursWorked: number }[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { taskName, hoursWorked } = req.body;
    if (!taskName || typeof hoursWorked !== "number") {
      return res.status(400).json({ error: "Invalid input" });
    }
    const newTask = { taskName, hoursWorked };
    tasks.push(newTask);
    return res.status(201).json(newTask);
  }

  if (req.method === "DELETE") {
    const { index } = req.body;
    if (typeof index !== "number" || index < 0 || index >= tasks.length) {
      return res.status(400).json({ error: "Invalid Index" });
    }
    tasks.splice(index, 1);
    return res.status(200).json({ success: true });
  }
  if (req.method === "PUT") {
    const { index, taskName, hoursWorked } = req.body;
    if (
      typeof index !== "number" ||
      !taskName ||
      typeof hoursWorked !== "number" ||
      index < 0 ||
      index >= tasks.length
    ) {
    return res.status(400).json({ error: "Invalid input" }); 
    }
    tasks[index] = { taskName, hoursWorked };
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
