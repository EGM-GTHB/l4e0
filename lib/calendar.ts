export type Slot = { weekday:number; start:string; end:string; subject:string };
export type WeekTemplate = { label:"A"|"B"; slots: Slot[] };

export function isHoliday(dateYMD:string, holidays:Set<string>){ return holidays.has(dateYMD); }

function inPeriod(d:Date,p:{start:string;end:string}){ return +d>=+new Date(p.start) && +d<+new Date(p.end); }

export function weekLabelFor(date:Date, mondayA:Date, breaks:{start:string;end:string}[]):"A"|"B"{
  let count=0; const d=new Date(mondayA);
  while(d<=date){
    const weekEnd=new Date(d); weekEnd.setDate(weekEnd.getDate()+6);
    const wholeBreak = breaks.some(p=> inPeriod(d,p) && inPeriod(weekEnd,p));
    if(!wholeBreak) count++;
    d.setDate(d.getDate()+7);
  }
  return (count%2===1)?"A":"B";
}

export function ymd(d:Date){ return d.toISOString().slice(0,10); }

export function parseAllDayICS(icsText:string): string[] {
  const lines = icsText.split(/\r?\n/);
  const out:string[]=[];
  for(const l of lines){
    if(l.startsWith("DTSTART;VALUE=DATE:")){
      const s = l.split(":")[1];
      out.push(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`);
    }
  }
  return out;
}
