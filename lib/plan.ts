import type { Assignment, Task } from "@/lib/db";

export function planForDay(assignments:Assignment[], minutes=60){
  const byDue = [...assignments].sort((a,b)=> a.due.localeCompare(b.due));
  const out: Task[] = []; let left = minutes;
  for(const a of byDue){
    if(left <= 0) break;
    const chunk = Math.min(15, Math.max(8, Math.round((a.estimateMin||20)/2)));
    if(chunk <= left){
      out.push({
        id: crypto.randomUUID(),
        assignmentId: a.id,
        day: new Date().toISOString().slice(0,10),
        durationMin: chunk,
        topic: a.title || a.subject,
        firstAction: "Ouvrir cahier/consigne"
      });
      left -= chunk;
    }
  }
  return out;
}
