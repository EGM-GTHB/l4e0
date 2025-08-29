export function streakDays(datesYMD:string[]): number {
  if(!datesYMD.length) return 0;
  const set = new Set(datesYMD);
  let streak=0; let d=new Date();
  while(set.has(d.toISOString().slice(0,10))){
    streak++;
    d.setDate(d.getDate()-1);
  }
  return streak;
}
