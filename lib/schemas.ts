import { z } from "zod";

export const AssignType = z.enum(["DM","DST","Exposé","Révision"]);
export const Assignment = z.object({
  id: z.string(),
  subject: z.string().min(1),
  due: z.string().min(8),
  type: AssignType,
  title: z.string().optional(),
  rawText: z.string().optional(),
  estimateMin: z.number().int().positive().optional(),
  source: z.enum(["ED","AGENDA"])
});
export const AssignmentList = z.object({ items: z.array(Assignment) });

export const QuizItem = z.object({
  id: z.string(),
  kind: z.enum(["MCQ","SHORT"]),
  q: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.string(),
  explanation: z.string().optional()
});
export const Quiz = z.object({ id: z.string(), taskId: z.string(), items: z.array(QuizItem).min(3).max(5) });

export const Evaluation = z.object({
  id: z.string(),
  assignmentId: z.string(),
  accuracy: z.number().min(0).max(100),
  method: z.number().min(0).max(100),
  coverage: z.number().min(0).max(100),
  presentation: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  finalScore: z.number().min(0).max(100),
  rationale: z.string().optional()
});
