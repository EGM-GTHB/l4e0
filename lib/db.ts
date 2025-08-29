import Dexie, { Table } from "dexie";

export interface PointRow { id:string; ts:number; kind:"quiz"|"devoir"|"bonus"; delta:number; refId?:string }
export interface CostRow { id:string; ts:number; model:string; inTok:number; outTok:number }
export interface SettingRow { id:string; key:string; value:any }

export interface Assignment { id:string; subject:string; due:string; type:string; title?:string; rawText?:string; estimateMin?:number; source:"ED"|"AGENDA" }
export interface Task { id:string; assignmentId?:string; day:string; durationMin:number; firstAction:string; topic:string }
export interface Quiz { id:string; taskId:string; items:any[] }
export interface Evaluation { id:string; assignmentId:string; accuracy:number; method:number; coverage:number; presentation:number; confidence:number; finalScore:number; rationale?:string }

export class L4E0DB extends Dexie {
  assignments!: Table<Assignment, string>;
  tasks!: Table<Task, string>;
  quizzes!: Table<Quiz, string>;
  evaluations!: Table<Evaluation, string>;
  points!: Table<PointRow, string>;
  costs!: Table<CostRow, string>;
  settings!: Table<SettingRow, string>;

  constructor(){
    super("l4e0");
    this.version(2).stores({
      assignments: "id, due, subject",
      tasks: "id, day",
      quizzes: "id, taskId",
      evaluations: "id, assignmentId",
      points: "id, ts",
      costs: "id, ts, model",
      settings: "id, key"
    });
  }
}
export const db = new L4E0DB();
