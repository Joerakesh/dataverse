"use client";
import { useEffect, useRef } from "react";
type Ember={x:number;y:number;vx:number;vy:number;r:number;a:number;phase:number};
type Cloud={x:number;y:number;vx:number;radius:number;alpha:number;green:boolean};
export default function FogCanvas(){
 const ref=useRef<HTMLCanvasElement|null>(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext("2d",{alpha:true});if(!canvas||!ctx)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,mobile=window.matchMedia("(max-width:640px)").matches;
  let w=0,h=0,dpr=1,raf=0,last=0,visible=!document.hidden;
  const embers:Ember[]=Array.from({length:mobile?16:34},()=>({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.00035,vy:-(.00018+Math.random()*.00045),r:.7+Math.random()*1.5,a:.16+Math.random()*.3,phase:Math.random()*6.28}));
  const clouds:Cloud[]=Array.from({length:mobile?4:7},(_,i)=>({x:Math.random(),y:.15+Math.random()*.8,vx:(i%2?1:-1)*(.00008+Math.random()*.00012),radius:.16+Math.random()*.2,alpha:.035+Math.random()*.035,green:i%3!==0}));
  const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,1.35);w=window.innerWidth;h=window.innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);};
  const render=(time:number)=>{if(!visible)return;if(time-last<40){raf=requestAnimationFrame(render);return;}last=time;ctx.clearRect(0,0,w,h);
   const base=ctx.createRadialGradient(w*.52,h*.35,0,w*.52,h*.4,Math.max(w,h)*.85);base.addColorStop(0,"rgba(11,42,26,.28)");base.addColorStop(.5,"rgba(6,18,12,.18)");base.addColorStop(1,"rgba(5,8,6,0)");ctx.fillStyle=base;ctx.fillRect(0,0,w,h);
   for(const c of clouds){if(!reduced){c.x+=c.vx;if(c.x<-.3)c.x=1.3;if(c.x>1.3)c.x=-.3;}const x=c.x*w,y=c.y*h,r=c.radius*Math.max(w,h),g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c.green?"rgba(16,185,129,"+c.alpha+")":"rgba(0,255,102,"+(c.alpha*.6)+")");g.addColorStop(.55,"rgba(5,45,25,"+(c.alpha*.45)+")");g.addColorStop(1,"rgba(5,8,6,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
   for(const e of embers){if(!reduced){e.x+=e.vx+Math.sin(e.phase)*.00015;e.y+=e.vy;e.phase+=.025;if(e.y<-.02){e.y=1.02;e.x=Math.random();}}const x=e.x*w,y=e.y*h,a=e.a*(.7+.3*Math.sin(e.phase)),r=e.r,g=ctx.createRadialGradient(x,y,0,x,y,r*5);g.addColorStop(0,"rgba(0,255,102,"+a+")");g.addColorStop(.45,"rgba(16,185,129,"+(a*.4)+")");g.addColorStop(1,"rgba(0,255,102,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*5,0,Math.PI*2);ctx.fill();ctx.fillStyle="rgba(220,255,235,"+a+")";ctx.beginPath();ctx.arc(x,y,r*.55,0,Math.PI*2);ctx.fill();}
   if(!reduced)raf=requestAnimationFrame(render);
  };
  const visibility=()=>{visible=!document.hidden;if(visible){last=0;if(!reduced)raf=requestAnimationFrame(render);}else cancelAnimationFrame(raf);};
  resize();window.addEventListener("resize",resize,{passive:true});document.addEventListener("visibilitychange",visibility);render(0);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);document.removeEventListener("visibilitychange",visibility);};
 },[]);
 return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full"/>;
}
