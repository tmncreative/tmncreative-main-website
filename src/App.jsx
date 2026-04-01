import { useState, useEffect, useRef } from "react";
import PaymentPage from "./PaymentPage";

const C = {
  teal: "#1B6E8A", tealDark: "#134E63", tealDeep: "#0C2F3D",
  green: "#00D455", greenBright: "#00E85E",
  white: "#FFFFFF", offWhite: "#F4F8F9",
  lightTeal: "rgba(27,110,138,0.06)",
  gray: "#5A6B73", grayLight: "#8A9BA3", dark: "#091E27",
};
const F = { h: "'Playfair Display',Georgia,serif", b: "'DM Sans','Helvetica Neue',sans-serif" };

const GCSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{overflow-x:hidden;font-family:${F.b};background:${C.offWhite}}
::selection{background:rgba(0,212,85,.2)}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.reveal{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.23,1,.32,1),transform .7s cubic-bezier(.23,1,.32,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-d1{transition-delay:.1s}.reveal-d2{transition-delay:.2s}.reveal-d3{transition-delay:.3s}
.card-hover{transition:transform .3s ease,box-shadow .3s ease}
.card-hover:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(27,110,138,.1)}
.partner-track{display:flex;align-items:center;gap:0;animation:ticker 18s linear infinite;width:max-content}
.partner-track:hover{animation-play-state:paused}
.ba-slider{position:relative;overflow:hidden;border-radius:4px;cursor:ew-resize;user-select:none}
.ba-handle{position:absolute;top:0;bottom:0;width:3px;background:#00D455;cursor:ew-resize;z-index:3;transform:translateX(-50%)}
.ba-handle::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:#00D455;border:3px solid #fff;box-shadow:0 2px 12px rgba(0,0,0,.3)}
.ba-handle::after{content:'◀ ▶';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:10px;color:#091E27;font-weight:700;letter-spacing:-1px;margin-top:0px;pointer-events:none}
@media(max-width:768px){
  .hide-m{display:none!important}
  .m-stack{grid-template-columns:1fr!important}
  .m-pad{padding-left:20px!important;padding-right:20px!important}
  .m-txt h1{font-size:36px!important}
  .m-txt h2{font-size:26px!important}
}
@media(min-width:769px){.hide-d{display:none!important}}
`;

function useReveal(){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("visible");obs.unobserve(el)}},{threshold:.12,rootMargin:"0px 0px -40px 0px"});
    obs.observe(el);return()=>obs.disconnect();
  },[]);return ref;
}
function R({children,delay=0,className=""}){
  const ref=useReveal();
  const dc=delay===1?" reveal-d1":delay===2?" reveal-d2":delay===3?" reveal-d3":"";
  return <div ref={ref} className={`reveal${dc} ${className}`}>{children}</div>;
}

function Logo({size=48,dark=false}){
  return <img src={dark?"/logo-dark.png":"/logo-t.png"} alt="QC Atlantic" style={{width:size,height:"auto",display:"block"}} />;
}

function HeroBG(){
  return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 30% 40%,${C.tealDark},${C.tealDeep} 50%,${C.dark} 100%)`}}/>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.03}} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="hx" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
        <path d="M28 2L54 18V50L28 66 2 50V18Z" fill="none" stroke={C.green} strokeWidth=".5"/>
        <path d="M28 68L54 84V116L28 132 2 116V84Z" fill="none" stroke={C.green} strokeWidth=".5"/>
        <path d="M-28 34L-2 50V82L-28 98-54 82V50Z" fill="none" stroke={C.green} strokeWidth=".5"/>
        <path d="M84 34L110 50V82L84 98 58 82V50Z" fill="none" stroke={C.green} strokeWidth=".5"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#hx)"/>
    </svg>
    <div style={{position:"absolute",top:"20%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:`radial-gradient(circle,${C.green}06,transparent 70%)`}}/>
    <div style={{position:"absolute",bottom:"-10%",right:"-15%",width:"60vw",height:"60vw",borderRadius:"50%",background:`radial-gradient(circle,${C.teal}06,transparent 60%)`}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,transparent 5%,${C.green},transparent 95%)`}}/>
    <div style={{position:"absolute",bottom:0,left:0,right:0,height:120,background:`linear-gradient(0deg,${C.offWhite},transparent)`}}/>
    <img src="/logo-w.png" alt="" style={{position:"absolute",left:"50%",top:"5%",transform:"translateX(-50%)",width:"clamp(500px,90vw,1200px)",height:"auto",opacity:.04,pointerEvents:"none",userSelect:"none"}}/>
  </div>);
}

function SBG(){
  return(<div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <div style={{position:"absolute",inset:0,background:`linear-gradient(160deg,${C.dark} 0%,${C.tealDeep} 100%)`}}/>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.025}} xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="hx2" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
        <path d="M28 2L54 18V50L28 66 2 50V18Z" fill="none" stroke={C.green} strokeWidth=".5"/>
      </pattern></defs><rect width="100%" height="100%" fill="url(#hx2)"/>
    </svg>
  </div>);
}

function Lbl({children}){return <div style={{fontFamily:F.b,fontSize:11.5,letterSpacing:".2em",textTransform:"uppercase",color:C.green,marginBottom:14,fontWeight:600}}>{children}</div>}

function Nav({currentPage,setPage}){
  const[scrolled,setScrolled]=useState(false);
  const[mob,setMob]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{document.body.style.overflow=mob?"hidden":"";return()=>{document.body.style.overflow=""}},[mob]);
  const pages=["Home","Products","About","Contact","Pay"];
  const go=p=>{setPage(p);setMob(false)};
  return(<>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"10px 0":"16px 0",background:scrolled?"rgba(12,47,61,.97)":"transparent",backdropFilter:scrolled?"blur(16px)":"none",transition:"all .35s",borderBottom:scrolled?`1px solid rgba(0,212,85,.1)`:"none"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div onClick={()=>go("Home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <Logo size={30} dark/><span style={{fontFamily:F.h,fontSize:19,fontWeight:700,color:C.white}}>QC Atlantic</span>
        </div>
        <div className="hide-m" style={{display:"flex",alignItems:"center",gap:28}}>
          {pages.map(p=><button key={p} onClick={()=>go(p)} style={{background:"none",border:"none",fontFamily:F.b,fontSize:12.5,fontWeight:currentPage===p?600:400,color:currentPage===p?C.green:"rgba(255,255,255,.65)",cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase",padding:"4px 0",borderBottom:currentPage===p?`2px solid ${C.green}`:"2px solid transparent",transition:"all .2s"}}>{p}</button>)}
          <button onClick={()=>go("Contact")} style={{fontFamily:F.b,fontSize:12,fontWeight:600,padding:"9px 22px",background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2}}>Get Started</button>
        </div>
        <button className="hide-d" onClick={()=>setMob(!mob)} style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",flexDirection:"column",gap:5}}>
          <span style={{display:"block",width:24,height:2,background:C.white,transition:"all .3s",transform:mob?"rotate(45deg) translateY(7px)":"none"}}/>
          <span style={{display:"block",width:24,height:2,background:C.white,transition:"all .3s",opacity:mob?0:1}}/>
          <span style={{display:"block",width:24,height:2,background:C.white,transition:"all .3s",transform:mob?"rotate(-45deg) translateY(-7px)":"none"}}/>
        </button>
      </div>
    </nav>
    {mob&&<div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(9,30,39,.98)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,animation:"fadeIn .25s ease"}}>
      {pages.map(p=><button key={p} onClick={()=>go(p)} style={{background:"none",border:"none",fontFamily:F.h,fontSize:28,fontWeight:700,color:currentPage===p?C.green:C.white,cursor:"pointer",padding:"12px 0"}}>{p}</button>)}
      <button onClick={()=>go("Contact")} style={{fontFamily:F.b,fontSize:14,fontWeight:600,padding:"14px 40px",marginTop:16,background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2}}>Get Started</button>
    </div>}
  </>);
}

function PCard({cat,alt}){
  return(<div className="card-hover" style={{background:alt?C.offWhite:C.white,border:`1px solid rgba(27,110,138,.06)`,borderRadius:4,overflow:"hidden"}}>
    <div style={{height:3,background:`linear-gradient(90deg,${C.teal},${C.green})`}}/>
    <div style={{padding:"26px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <h3 style={{fontFamily:F.h,fontSize:21,fontWeight:700,color:C.tealDeep,margin:0}}>{cat.name}</h3>
        <span style={{fontFamily:F.b,fontSize:10,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",color:C.teal,background:C.lightTeal,padding:"4px 10px",borderRadius:2,whiteSpace:"nowrap"}}>{cat.tag}</span>
      </div>
      <p style={{fontFamily:F.b,fontSize:13.5,color:C.gray,lineHeight:1.7,margin:"0 0 18px"}}>{cat.desc}</p>
      <div style={{borderTop:`1px solid rgba(27,110,138,.06)`,paddingTop:14,display:"flex",flexWrap:"wrap",gap:6}}>
        {cat.products.map((p,j)=><span key={j} style={{fontFamily:F.b,fontSize:11.5,color:C.teal,background:alt?C.white:C.offWhite,padding:"4px 10px",borderRadius:2,fontWeight:500}}>{p}</span>)}
      </div>
    </div>
  </div>);
}

function LogoCard({src,alt,desc,alt2}){
  return(<div className="card-hover" style={{background:alt2?C.offWhite:C.white,border:`1px solid rgba(27,110,138,.06)`,borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"36px 32px",minHeight:200}}>
    <div style={{height:3,background:`linear-gradient(90deg,${C.teal},${C.green})`,position:"absolute",top:0,left:0,right:0}}/>
    <img src={src} alt={alt} style={{maxWidth:"80%",maxHeight:120,width:"auto",height:"auto",display:"block",marginBottom:desc?16:0}}/>
    {desc&&<p style={{fontFamily:F.b,fontSize:12.5,color:C.grayLight,textAlign:"center",lineHeight:1.6,margin:0}}>{desc}</p>}
  </div>);
}

function BeforeAfter(){
  const[pos,setPos]=useState(50);
  const ref=useRef(null);
  const drag=useRef(false);
  const move=e=>{
    if(!drag.current&&e.type!=="click")return;
    const r=ref.current.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    setPos(Math.min(98,Math.max(2,(x/r.width)*100)));
  };
  return(
    <div ref={ref} className="ba-slider" style={{aspectRatio:"16/9",touchAction:"none"}}
      onMouseDown={()=>{drag.current=true}}
      onMouseUp={()=>{drag.current=false}}
      onMouseLeave={()=>{drag.current=false}}
      onMouseMove={move}
      onTouchMove={move}
      onClick={move}>
      <img src="/photos/after.jpg" alt="After" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
      <div style={{position:"absolute",inset:0,overflow:"hidden",width:`${pos}%`}}>
        <img src="/photos/before.jpg" alt="Before" style={{position:"absolute",inset:0,width:`${10000/pos}%`,maxWidth:"none",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
      </div>
      <div className="ba-handle" style={{left:`${pos}%`}}/>
      <div style={{position:"absolute",top:14,left:14,background:"rgba(9,30,39,.75)",padding:"5px 12px",borderRadius:2,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#fff",letterSpacing:".08em",textTransform:"uppercase",backdropFilter:"blur(4px)"}}>Before</div>
      <div style={{position:"absolute",top:14,right:14,background:"rgba(0,212,85,.85)",padding:"5px 12px",borderRadius:2,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#091E27",letterSpacing:".08em",textTransform:"uppercase"}}>After</div>
    </div>
  );
}

function HomePage({setPage}){
  const[vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),150)},[]);
  return(<div>
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden"}}>
      <HeroBG/>
      <div className="m-pad m-txt" style={{maxWidth:860,margin:"0 auto",padding:"150px 32px 100px",textAlign:"center",position:"relative",zIndex:1,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:"all .9s cubic-bezier(.23,1,.32,1)"}}>
        <Lbl>Customizable Car Wash Chemistry</Lbl>
        <h1 style={{fontFamily:F.h,fontSize:"clamp(40px,7vw,78px)",fontWeight:700,color:C.white,lineHeight:1.05,margin:"0 0 24px",letterSpacing:"-.03em"}}>Chemistry.<br/><span style={{color:C.green,fontStyle:"italic"}}>Not Soap.</span></h1>
        <p style={{fontFamily:F.b,fontSize:"clamp(16px,2.2vw,18px)",color:"rgba(255,255,255,.5)",maxWidth:520,margin:"0 auto 44px",lineHeight:1.7}}>Car wash chemistry customizable to your car wash, your water, and your market. Cleaner cars, drier cars, shinier cars, and a lower cost per car.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setPage("Contact")} style={{fontFamily:F.b,fontSize:14,fontWeight:600,padding:"15px 36px",background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2,boxShadow:`0 4px 20px ${C.green}33`}}>Schedule a Trial</button>
          <button onClick={()=>setPage("Products")} style={{fontFamily:F.b,fontSize:14,fontWeight:500,padding:"15px 36px",background:"rgba(255,255,255,.06)",color:C.white,border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2,backdropFilter:"blur(4px)"}}>See Our Chemistry</button>
        </div>
      </div>
    </section>
    <div style={{background:`linear-gradient(180deg,${C.dark} 0%,${C.tealDeep} 100%)`,padding:"28px 0",overflow:"hidden",position:"relative",borderBottom:`1px solid rgba(0,212,85,.08)`}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:`linear-gradient(90deg,${C.dark},transparent)`,zIndex:2,pointerEvents:"none"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:`linear-gradient(270deg,${C.tealDeep},transparent)`,zIndex:2,pointerEvents:"none"}}/>
      <div style={{overflow:"hidden"}}>
        <div className="partner-track">
          {[
            {src:"/blair-logo-white.png",alt:"Blair Ceramics",label:"Blair Ceramics"},
            {src:"/oasis-logo.png",alt:"Oasis Car Wash Systems",label:"Oasis Car Wash Systems"},
            {src:"/drb-logo.png",alt:"DRB Systems",label:"DRB Systems"},
            {src:"/blair-logo-white.png",alt:"Blair Ceramics",label:"Blair Ceramics"},
            {src:"/oasis-logo.png",alt:"Oasis Car Wash Systems",label:"Oasis Car Wash Systems"},
            {src:"/drb-logo.png",alt:"DRB Systems",label:"DRB Systems"},
            {src:"/blair-logo-white.png",alt:"Blair Ceramics",label:"Blair Ceramics"},
            {src:"/oasis-logo.png",alt:"Oasis Car Wash Systems",label:"Oasis Car Wash Systems"},
            {src:"/drb-logo.png",alt:"DRB Systems",label:"DRB Systems"},
            {src:"/blair-logo-white.png",alt:"Blair Ceramics",label:"Blair Ceramics"},
            {src:"/oasis-logo.png",alt:"Oasis Car Wash Systems",label:"Oasis Car Wash Systems"},
            {src:"/drb-logo.png",alt:"DRB Systems",label:"DRB Systems"},
          ].map((p,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:16,padding:"0 52px",flexShrink:0,borderRight:`1px solid rgba(255,255,255,.06)`}}>
              <img src={p.src} alt={p.alt} style={{height:36,width:"auto",opacity:.75,filter:"brightness(1.2)"}}/>
              <span style={{fontFamily:F.b,fontSize:11,fontWeight:600,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.3)",whiteSpace:"nowrap"}}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <section style={{background:C.white,borderBottom:`1px solid ${C.lightTeal}`}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",padding:"48px 32px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,textAlign:"center"}}>
        {[{n:"10+",l:"Years of Customizable Chemistry"},{n:"1",l:"Point of Contact. Always."},{n:"100%",l:"Operator-Minded"}].map((s,i)=>
          <R key={i} delay={i+1}><div style={{fontFamily:F.h,fontSize:"clamp(32px,5vw,42px)",fontWeight:700,color:C.teal,lineHeight:1}}>{s.n}</div><div style={{fontFamily:F.b,fontSize:12.5,color:C.grayLight,marginTop:8}}>{s.l}</div></R>
        )}
      </div>
    </section>
    <section style={{background:C.offWhite}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",padding:"88px 32px"}}>
        <R><div style={{textAlign:"center",marginBottom:56}}><Lbl>Why QC Atlantic</Lbl><h2 style={{fontFamily:F.h,fontSize:"clamp(26px,4vw,40px)",color:C.tealDeep,margin:0,fontWeight:700}}>Complete Control of Your Chemistry</h2></div></R>
        <div className="m-stack" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}>
          {[{icon:"⚗️",title:"Customizable to Your Wash",desc:"Every car wash is different. We customize chemistry to your equipment, water quality, wash length, and dwell time. You get complete control over cleaning power, foam profile, and cost per car, all dialed independently."},{icon:"📊",title:"Cleaner. Drier. Shinier.",desc:"Every application we set up is designed with drying in mind. From dual pH presoaks that tackle both organic and inorganic soils to protectants that prep the surface for a spot-free finish, the whole system works together."},{icon:"🤝",title:"Service Starts at the Sale",desc:"You deal with Winston directly. Not a call center, not a regional manager. When you have a problem at 6am on a Saturday, you get someone who has spent a decade solving those exact problems in backrooms across the country."}].map((c,i)=>
            <R key={i} delay={i+1}><div className="card-hover" style={{background:C.white,padding:"36px 32px",border:`1px solid rgba(27,110,138,.06)`,borderRadius:4,position:"relative",overflow:"hidden",height:"100%"}}><div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.teal},${C.green})`}}/><div style={{fontSize:28,marginBottom:18}}>{c.icon}</div><h3 style={{fontFamily:F.h,fontSize:20,fontWeight:700,color:C.tealDeep,margin:"0 0 10px"}}>{c.title}</h3><p style={{fontFamily:F.b,fontSize:14,color:C.gray,lineHeight:1.7,margin:0}}>{c.desc}</p></div></R>
          )}
        </div>
      </div>
    </section>
    <section style={{background:C.white}}>
      <div className="m-pad m-stack" style={{maxWidth:1100,margin:"0 auto",padding:"80px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
        <R><div>
          <Lbl>Who We Are</Lbl>
          <h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,36px)",color:C.tealDeep,margin:"0 0 20px",fontWeight:700}}>Family-Owned. Operator-Minded.</h2>
          <p style={{fontFamily:F.b,fontSize:15.5,color:C.gray,lineHeight:1.8,margin:"0 0 16px"}}>QC Atlantic was built by someone who spent a decade in car wash backrooms before ever sending an invoice. Winston started this business because he knew operators were getting close enough — not dialed in.</p>
          <p style={{fontFamily:F.b,fontSize:15.5,color:C.gray,lineHeight:1.8,margin:"0 0 24px"}}>This is a family business. When Winston is out on a service call, there's a good chance his daughter is along for the ride — hands-on with the chemistry from day one.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 20px",background:C.offWhite,borderRadius:4,border:`1px solid rgba(27,110,138,.08)`}}>
            <span style={{fontSize:20}}>🧪</span>
            <span style={{fontFamily:F.b,fontSize:13,color:C.gray,fontStyle:"italic"}}>"She's already got better dilution ratios than most reps I've trained."</span>
          </div>
        </div></R>
        <R delay={1}><div style={{position:"relative"}}>
          <div style={{position:"absolute",top:-12,left:-12,right:12,bottom:12,background:C.offWhite,borderRadius:6,border:`1px solid rgba(27,110,138,.08)`,zIndex:0}}/>
          <img src="/photos/daughter.jpg" alt="Future chemist" style={{width:"100%",borderRadius:4,display:"block",position:"relative",zIndex:1,boxShadow:"0 8px 32px rgba(12,47,61,.12)"}}/>
          <div style={{position:"absolute",bottom:16,right:-8,zIndex:2,background:C.tealDeep,padding:"8px 14px",borderRadius:3,boxShadow:"0 4px 16px rgba(0,0,0,.2)"}}>
            <div style={{fontFamily:F.b,fontSize:11,fontWeight:600,color:C.green,letterSpacing:".1em",textTransform:"uppercase"}}>Blair Ceramics</div>
            <div style={{fontFamily:F.b,fontSize:10.5,color:"rgba(255,255,255,.5)"}}>SC Low pH — 5 gallons</div>
          </div>
        </div></R>
      </div>
    </section>
    <section style={{background:C.offWhite,padding:"80px 32px"}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto"}}>
        <R><div style={{textAlign:"center",marginBottom:44}}><Lbl>In the Field</Lbl><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,36px)",color:C.tealDeep,margin:0,fontWeight:700}}>Results You Can See</h2></div></R>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
          {[
            {src:"/photos/gallery-4.jpg",label:"Tesla Model Y — spot-free finish"},
            {src:"/photos/gallery-5.jpg",label:"Tundra — ceramic gloss after wash"},
            {src:"/photos/gallery-6.jpg",label:"Blair Ceramics precision dispensing system"},
            {src:"/photos/gallery-2.jpg",label:"Clean exit — high-gloss black SUV"},
          ].map((g,i)=>(
            <R key={i} delay={i<3?i+1:0}>
              <div className="card-hover" style={{borderRadius:4,overflow:"hidden",position:"relative",background:C.dark}}>
                <img src={g.src} alt={g.label} style={{width:"100%",height:240,objectFit:"cover",display:"block",opacity:.92}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 16px 14px",background:"linear-gradient(0deg,rgba(9,30,39,.85),transparent)"}}>
                  <span style={{fontFamily:F.b,fontSize:12,color:"rgba(255,255,255,.8)",fontWeight:500}}>{g.label}</span>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
    <section style={{background:C.white,padding:"80px 32px"}}>
      <div className="m-pad" style={{maxWidth:900,margin:"0 auto"}}>
        <R><div style={{textAlign:"center",marginBottom:44}}><Lbl>Before & After</Lbl><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,36px)",color:C.tealDeep,margin:"0 0 10px",fontWeight:700}}>The Difference Chemistry Makes</h2><p style={{fontFamily:F.b,fontSize:14.5,color:C.gray,margin:0}}>Drag the slider to compare. Same car, same wash — before and after a dialed-in chemistry program.</p></div></R>
        <R delay={1}><BeforeAfter/></R>
      </div>
    </section>
    <section style={{position:"relative",overflow:"hidden",padding:"80px 32px",textAlign:"center"}}>
      <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.tealDeep},${C.tealDark})`}}/>
      <div style={{position:"absolute",left:"50%",top:"50%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${C.green}06,transparent 70%)`,transform:"translate(-50%,-50%)"}}/>
      <R><div style={{position:"relative",zIndex:1}}>
        <h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,36px)",color:C.white,margin:"0 0 12px",fontWeight:700}}>Ready to own the car?</h2>
        <p style={{fontFamily:F.b,fontSize:15,color:"rgba(255,255,255,.45)",margin:"0 0 32px"}}>Schedule a trial and we'll build a customizable chemistry program for your car wash. No contracts, no pressure. Just results.</p>
        <button onClick={()=>setPage("Contact")} style={{fontFamily:F.b,fontSize:14,fontWeight:600,padding:"15px 44px",background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2,boxShadow:`0 4px 20px ${C.green}33`}}>Get in Touch</button>
      </div></R>
    </section>
  </div>);
}

function ProductsPage({setPage}){
  const[vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100)},[]);
  const blair=[
    {name:"Presoaks",tag:"Cleaning",desc:"Hi and Lo pH presoaks formulated with varying blends of acids and surfactants to penetrate and remove road film, oil, grease, bug residue, and mineral deposits. Available in HF, ABF, and acid-alternative formulations for touchless, friction, and self-serve applications.",products:["Hi-pH Presoak","Lo-pH Presoak","Impact Detergent","Acid Alternative Presoak"]},
    {name:"Ceramic Protectants",tag:"Premium",desc:"Blair's exclusive ceramic-infused line uses silica layering technology that builds with each wash. Quartz fills small surface imperfections over repeated use, leaving a deep mirror finish. Defender provides true hydrophobic clear coat protection with UV blockers.",products:["Quartz Full Body Protectant","Defender Clear Coat","Ceramic Shine","Ceramic Gloss (IBA)","Extreme Gloss Lava Polish"]},
    {name:"Foam & Conditioning",tag:"The Big Show",desc:"High-foaming shampoos and tri-color conditioners that deliver the visual impact customers expect. Deep cleaning, quick rinsing, pH-neutralizing formulas. Ceramic-infused options available across the line.",products:["Wicked Wash Triple Foam","Ceramic Foaming Shampoo","Conditioning Shampoo"]},
    {name:"Drying & Finish",tag:"The Finish",desc:"Ram Dry drying agent with ceramic properties aids rapid water removal without streaking. Non-MSO formula. Every Blair application is designed with drying in mind.",products:["Ram Dry Drying Agent","Spot-Free Rinse","Rain Repellent"]},
    {name:"Wheel, Tire & Specialty",tag:"Specialty",desc:"High-shine solvent-based nano-fortified tire dressing plus water-based options. Lo-pH wheel cleaners for brake dust and oxidation. Underbody rust inhibitor. Injection fragrances in 8+ scents.",products:["Tire Dressing","Wheel Brightener","Underbody Rust Inhibitor","Don't Bug Me Remover","Injection Fragrances"]},
  ];
  const oasis=[
    {name:"Typhoon",tag:"High Volume",desc:"The fastest touchless automatic on the market. Up to 40 cars per hour with dual-bridge high-pressure turbo nozzles, intelligent vehicle scanning, and hydraulic gear drive.",products:["Dual-Step Presoak","Turbo Nozzles","XPert Monitoring","Buy-Up Technology","5-Year Warranty"]},
    {name:"Eclipse",tag:"Unattended",desc:"Touchless automatic designed for 24/7 unattended operation. Wall-mounted frame and elevated carriage protect from strike damage. Open bay design. Eco-Wash package standard.",products:["Wall-Mounted Frame","Smart Dryer Integration","Eco-Wash Package","Remote Diagnostics","5-Year Warranty"]},
    {name:"XP",tag:"Touchless",desc:"Single-bridge, two-arm touchless automatic. Reliable cleaning at a lower price point than the Typhoon. Same Oasis build quality and warranty.",products:["Single Bridge Design","Two-Arm System","Vehicle Scanning","XPert Monitoring","5-Year Warranty"]},
    {name:"BayWash i5",tag:"Soft-Touch",desc:"Oasis took the Sonny's i5 platform and loaded it with upgrades. Top washes around 4:20 with ceramic. Multiple processes per pass. Best friction machine for in-bay automatic operators.",products:["Friction Wash System","Multi-Process Passes","Ceramic Compatible","Wheel Blasters","5-Year Warranty"]},
    {name:"Self-Service & Drying",tag:"Support",desc:"JetStream self-service equipment. Adapt and GaleForce high-velocity drying systems that integrate with any Oasis automatic.",products:["JetStream Self-Service","Adapt Drying System","GaleForce Dryers"]},
  ];
  return(<div>
    <section style={{position:"relative",padding:"160px 32px 80px",textAlign:"center"}}><SBG/>
      <div className="m-pad m-txt" style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:1,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:"all .6s"}}>
        <Lbl>Product Lines</Lbl>
        <h1 style={{fontFamily:F.h,fontSize:"clamp(30px,5vw,50px)",color:C.white,margin:"0 0 14px",fontWeight:700}}>Chemistry + Equipment</h1>
        <p style={{fontFamily:F.b,fontSize:16,color:"rgba(255,255,255,.5)",margin:0,lineHeight:1.6}}>Chemistry by Blair Ceramics. Equipment by Oasis Car Wash Systems. Customizable chemistry programs built around your car wash by QC Atlantic.</p>
      </div>
    </section>
    <section style={{background:C.offWhite}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",padding:"80px 32px"}}>
        <R><div style={{marginBottom:44}}><Lbl>Chemistry</Lbl><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,34px)",color:C.tealDeep,margin:"0 0 10px",fontWeight:700}}>Blair Ceramics</h2><p style={{fontFamily:F.b,fontSize:14.5,color:C.gray,lineHeight:1.7,maxWidth:680,margin:0}}>30+ years of car wash chemistry innovation. Blair's exclusive ceramic-infused line uses silica layering technology that builds protection with every wash.</p></div></R>
        <div className="m-stack" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:22}}>
          <R delay={1}><div style={{position:"relative"}}><LogoCard src="/blair-logo.png" alt="Blair Ceramics" desc="Superior Shine. Superior Protection." alt2={false}/></div></R>
          {blair.map((c,i)=><R key={i} delay={i<2?i+2:0}><PCard cat={c} alt={false}/></R>)}
        </div>
      </div>
    </section>
    <section style={{background:C.white}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",padding:"80px 32px"}}>
        <R><div style={{marginBottom:44}}><div style={{fontFamily:F.b,fontSize:11.5,letterSpacing:".2em",textTransform:"uppercase",color:C.teal,marginBottom:14,fontWeight:600}}>Equipment</div><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,34px)",color:C.tealDeep,margin:"0 0 10px",fontWeight:700}}>Oasis Car Wash Systems</h2><p style={{fontFamily:F.b,fontSize:14.5,color:C.gray,lineHeight:1.7,maxWidth:680,margin:0}}>Family-owned since 1964. From the Typhoon (fastest touchless on the market) to the BayWash i5, every unit comes with a 5-year warranty and XPert remote monitoring.</p></div></R>
        <div className="m-stack" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:22}}>
          <R delay={1}><div style={{position:"relative"}}><LogoCard src="/oasis-logo.png" alt="Oasis Car Wash Systems" desc="Family-owned since 1964. 5-year warranty on every unit." alt2={true}/></div></R>
          {oasis.map((c,i)=><R key={i} delay={i<2?i+2:0}><PCard cat={c} alt={true}/></R>)}
        </div>
      </div>
    </section>
    <section style={{background:C.offWhite}}>
      <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",padding:"80px 32px"}}>
        <R><div style={{marginBottom:44}}><div style={{fontFamily:F.b,fontSize:11.5,letterSpacing:".2em",textTransform:"uppercase",color:C.teal,marginBottom:14,fontWeight:600}}>POS & Site Management</div><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,34px)",color:C.tealDeep,margin:"0 0 10px",fontWeight:700}}>DRB Systems</h2><p style={{fontFamily:F.b,fontSize:14.5,color:C.gray,lineHeight:1.7,maxWidth:680,margin:0}}>The leading car wash technology company. DRB powers point-of-sale, site management, loyalty, and fleet solutions across tunnel and in-bay operations of every size.</p></div></R>
        <div className="m-stack" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:22}}>
          <R delay={1}><div style={{position:"relative"}}><LogoCard src="/drb-logo.png" alt="DRB Systems" desc="Powering the car wash industry." alt2={false}/></div></R>
          {[
            {name:"Patheon",tag:"POS & Management",desc:"DRB's flagship cloud-based point-of-sale and site management platform. Real-time dashboards, multi-location control, and deep reporting built for operators running 1 site or 100.",products:["Cloud POS","Multi-Site Dashboard","Real-Time Reporting","Employee Management","Inventory Tracking"]},
            {name:"FastPass",tag:"Unlimited Wash",desc:"DRB's unlimited wash plan platform. Manages memberships, billing, and RFID or license plate recognition for frictionless entry. The industry standard for recurring revenue programs.",products:["Membership Billing","RFID & LPR Entry","Plan Management","Churn Reporting","Mobile App Ready"]},
            {name:"Suds",tag:"Fleet",desc:"Fleet account management built into the DRB ecosystem. Commercial fleet operators get a dedicated portal, volume pricing, and consolidated billing — all managed without staff involvement.",products:["Fleet Portal","Volume Pricing","Consolidated Billing","Vehicle Tracking","Self-Service Sign-Up"]},
            {name:"TunnelWatch",tag:"Tunnel Control",desc:"Real-time tunnel monitoring and control software. Tracks every vehicle through the tunnel, flags exceptions, and gives managers full visibility into throughput and uptime.",products:["Vehicle Tracking","Exception Alerts","Throughput Metrics","Camera Integration","Remote Access"]},
            {name:"Beacon",tag:"Marketing",desc:"DRB's customer engagement and marketing platform. Automated campaigns, win-back flows, and loyalty tools that keep members active and attract new customers.",products:["Automated Campaigns","Win-Back Flows","Loyalty Programs","Email & SMS","Performance Analytics"]},
          ].map((c,i)=><R key={i} delay={i<2?i+2:0}><PCard cat={c} alt={false}/></R>)}
        </div>
      </div>
    </section>
    <section style={{position:"relative",padding:"72px 32px",textAlign:"center",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:C.tealDeep}}/><R><div style={{position:"relative",zIndex:1}}><h2 style={{fontFamily:F.h,fontSize:"clamp(22px,3.5vw,32px)",color:C.white,margin:"0 0 10px",fontWeight:700}}>Need chemistry, equipment, or both?</h2><p style={{fontFamily:F.b,fontSize:14.5,color:"rgba(255,255,255,.45)",margin:"0 0 28px"}}>We'll visit your site, evaluate your setup, and build a program that covers everything from presoak to drying system.</p><button onClick={()=>setPage("Contact")} style={{fontFamily:F.b,fontSize:13,fontWeight:600,padding:"13px 36px",background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2}}>Request a Consultation</button></div></R></section>
  </div>);
}

function AboutPage({setPage}){
  const[vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100)},[]);
  const tl=[
    {y:"2016",r:"Territory Manager",c:"Carolina Pride Carwash Systems",n:"Top Sales Rep and Top Growth Rep. Managed customer acquisition, deliveries, and chemical programs across the Charlotte territory."},
    {y:"2019",r:"Senior Account Manager",c:"Qual Chem LLC",n:"Built the Colorado territory from zero. Grew it 30%+ year over year working with top-tier operators."},
    {y:"2023",r:"Chemical Sales Manager",c:"AUTEC Car Wash Systems",n:"Managed chemical sales nationally for 2.5 years across car wash and in-bay configurations."},
    {y:"2026",r:"Founder & President",c:"QC Atlantic",n:"Chemistry. Not Soap. Serving operators across the Atlantic region from Clemmons, NC.",hl:true},
  ];
  return(<div>
    <section style={{position:"relative",padding:"160px 32px 80px",textAlign:"center"}}><SBG/>
      <div className="m-pad m-txt" style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:1,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:"all .6s"}}>
        <Lbl>About QC Atlantic</Lbl>
        <h1 style={{fontFamily:F.h,fontSize:"clamp(30px,5vw,50px)",color:C.white,margin:"0 0 14px",fontWeight:700}}>Operator-Minded from Day One</h1>
        <p style={{fontFamily:F.b,fontSize:16,color:"rgba(255,255,255,.5)",margin:0,lineHeight:1.6}}>Winston Matney has spent his career inside car wash backrooms, diagnosing chemistry problems and helping operators produce the cleanest, driest, shiniest cars in their markets.</p>
      </div>
    </section>
    <section style={{background:C.white}}>
      <div className="m-pad" style={{maxWidth:780,margin:"0 auto",padding:"72px 32px"}}>
        <R><div style={{fontFamily:F.b,fontSize:16.5,color:C.gray,lineHeight:1.85}}>
          <p style={{margin:"0 0 22px"}}>QC Atlantic was founded in Clemmons, North Carolina by a car wash chemical veteran who saw the same problem at every company he worked for: operators were getting chemistry that was close enough, but never truly dialed in.</p>
          <p style={{margin:"0 0 22px"}}>Winston spent a decade at companies like Qual Chem, Carolina Pride, and AUTEC. He built territories from scratch, grew established markets 30%+ year over year, and earned Top Sales Rep and Top Growth Rep honors along the way. More importantly, he learned how different chemistry platforms perform across different equipment, water qualities, climates, and car wash configurations.</p>
          <p style={{margin:"0 0 22px"}}>That experience is the foundation of QC Atlantic. When we build a chemistry program for your car wash, we are drawing on thousands of hours in car washes across the Southeast, the West, and Florida. We know what works in hard water and soft water, in 120-foot car washes and 60-foot express locations, during peak bug season and mild winters.</p>
          <p style={{margin:"0 0 22px"}}>At QC Atlantic, you are not handed off to a territory rep. Winston is your point of contact from trial through ongoing service. When a problem comes up, you talk to the person who can solve it, not someone who needs to escalate.</p>
          <p style={{margin:0,fontFamily:F.h,fontSize:21,fontWeight:700,color:C.tealDeep,fontStyle:"italic"}}>Chemistry for car wash operators, backed by someone who has been in your backroom.</p>
        </div></R>
      </div>
    </section>
    <section style={{background:C.offWhite}}>
      <div className="m-pad" style={{maxWidth:780,margin:"0 auto",padding:"72px 32px"}}>
        <R><div style={{textAlign:"center",marginBottom:48}}><Lbl>Experience</Lbl><h2 style={{fontFamily:F.h,fontSize:"clamp(24px,3.5vw,32px)",fontWeight:700,color:C.tealDeep,margin:0}}>10 Years Across the Industry</h2></div></R>
        <div style={{position:"relative"}}>
          <div className="hide-m" style={{position:"absolute",left:59,top:0,bottom:0,width:2,background:`linear-gradient(180deg,${C.teal}33,${C.green}66,${C.green})`}}/>
          {tl.map((t,i)=><R key={i}><div style={{display:"flex",gap:"clamp(12px,3vw,28px)",marginBottom:i<tl.length-1?28:0,alignItems:"flex-start"}}>
            <div style={{fontFamily:F.b,fontSize:13,fontWeight:700,color:t.hl?C.green:C.grayLight,minWidth:44,textAlign:"right",paddingTop:14}}>{t.y}</div>
            <div className="hide-m" style={{width:14,height:14,borderRadius:"50%",background:t.hl?C.green:C.teal,border:`3px solid ${C.offWhite}`,marginTop:16,flexShrink:0,position:"relative",zIndex:1,boxShadow:t.hl?`0 0 0 4px ${C.green}33`:"none"}}/>
            <div style={{background:C.white,padding:"14px 20px",border:t.hl?`2px solid ${C.green}44`:`1px solid rgba(27,110,138,.06)`,borderRadius:4,flex:1}}>
              <div style={{fontFamily:F.h,fontSize:16,fontWeight:700,color:C.tealDeep,marginBottom:2}}>{t.r}</div>
              <div style={{fontFamily:F.b,fontSize:13.5,fontWeight:600,color:C.teal,marginBottom:5}}>{t.c}</div>
              <div style={{fontFamily:F.b,fontSize:12.5,color:C.grayLight,lineHeight:1.5}}>{t.n}</div>
            </div>
          </div></R>)}
        </div>
      </div>
    </section>
    <section style={{position:"relative",padding:"64px 32px",textAlign:"center",overflow:"hidden"}}><div style={{position:"absolute",inset:0,background:C.tealDeep}}/><R><div style={{position:"relative",zIndex:1}}><h2 style={{fontFamily:F.h,fontSize:30,color:C.white,margin:"0 0 28px",fontWeight:700}}>Let's talk about your wash.</h2><button onClick={()=>setPage("Contact")} style={{fontFamily:F.b,fontSize:13,fontWeight:600,padding:"13px 36px",background:C.green,color:C.dark,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase",borderRadius:2}}>Get in Touch</button></div></R></section>
  </div>);
}

function ContactPage(){
  const[vis,setVis]=useState(false);
  const[form,setForm]=useState({name:"",email:"",phone:"",type:"",washes:"",message:""});
  const[submitted,setSubmitted]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),100)},[]);
  const go=()=>{if(form.name&&form.email)setSubmitted(true)};
  const inp={fontFamily:F.b,fontSize:15,padding:"13px 15px",border:`1px solid rgba(27,110,138,.12)`,borderRadius:3,background:C.white,color:C.tealDeep,width:"100%",boxSizing:"border-box",outline:"none",transition:"border-color .2s"};
  const lbl={fontFamily:F.b,fontSize:11.5,fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",color:C.teal,marginBottom:6,display:"block"};
  return(<div>
    <section style={{position:"relative",padding:"160px 32px 80px",textAlign:"center"}}><SBG/>
      <div className="m-pad m-txt" style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:1,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:"all .6s"}}>
        <Lbl>Get Started</Lbl>
        <h1 style={{fontFamily:F.h,fontSize:"clamp(30px,5vw,50px)",color:C.white,margin:"0 0 14px",fontWeight:700}}>Let's Talk Chemistry</h1>
        <p style={{fontFamily:F.b,fontSize:16,color:"rgba(255,255,255,.5)",margin:0,lineHeight:1.6}}>Whether you run 1 car wash or 20 locations, we'll build a chemical program around your operation.</p>
      </div>
    </section>
    <section style={{background:C.offWhite}}>
      <div className="m-pad m-stack" style={{maxWidth:900,margin:"0 auto",padding:"72px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48}}>
        <R><div>{submitted?
          <div style={{padding:44,background:C.white,border:`2px solid ${C.green}44`,borderRadius:4,textAlign:"center"}}><div style={{fontSize:44,marginBottom:14,color:C.green}}>✓</div><h3 style={{fontFamily:F.h,fontSize:23,color:C.tealDeep,margin:"0 0 8px"}}>Message Received</h3><p style={{fontFamily:F.b,fontSize:14.5,color:C.gray,margin:0}}>Winston will be in touch within 24 hours.</p></div>
          :<div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div><label style={lbl}>Name *</label><input style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor="rgba(27,110,138,.12)"}/></div>
            <div><label style={lbl}>Email *</label><input style={inp} type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor="rgba(27,110,138,.12)"}/></div>
            <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="(000) 000-0000" onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor="rgba(27,110,138,.12)"}/></div>
            <div><label style={lbl}>I am a...</label><select style={{...inp,cursor:"pointer"}} value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="">Select one</option><option value="operator">Car Wash Operator</option><option value="distributor">Distributor</option><option value="investor">Investor / Multi-Site Owner</option><option value="other">Other</option></select></div>
            <div><label style={lbl}>Wash Locations</label><input style={inp} value={form.washes} onChange={e=>setForm({...form,washes:e.target.value})} placeholder="e.g. 3" onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor="rgba(27,110,138,.12)"}/></div>
            <div><label style={lbl}>Message</label><textarea style={{...inp,minHeight:90,resize:"vertical"}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Tell us about your wash." onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor="rgba(27,110,138,.12)"}/></div>
            <button onClick={go} style={{fontFamily:F.b,fontSize:14.5,fontWeight:600,padding:"15px 0",background:form.name&&form.email?C.green:C.grayLight,color:C.dark,border:"none",borderRadius:2,cursor:form.name&&form.email?"pointer":"not-allowed",letterSpacing:".04em",textTransform:"uppercase",width:"100%",transition:"all .2s"}}>Send Message</button>
          </div>
        }</div></R>
        <R delay={1}><div>
          <div style={{background:C.white,padding:32,border:`1px solid rgba(27,110,138,.06)`,borderRadius:4,marginBottom:20}}>
            <h3 style={{fontFamily:F.h,fontSize:21,fontWeight:700,color:C.tealDeep,margin:"0 0 22px"}}>Direct Contact</h3>
            {[{l:"Winston Matney",v:"President, Owner"},{l:"Phone",v:"(336) 909-8321"},{l:"Email",v:"wmatney@qcatlantic.com"},{l:"Location",v:"Clemmons, North Carolina"}].map((x,i)=>
              <div key={i} style={{marginBottom:i<3?16:0}}><div style={{fontFamily:F.b,fontSize:10.5,fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:C.grayLight,marginBottom:2}}>{x.l}</div><div style={{fontFamily:F.b,fontSize:15.5,color:C.tealDeep,fontWeight:500}}>{x.v}</div></div>
            )}
          </div>
          <div style={{background:`linear-gradient(135deg,${C.tealDeep},${C.tealDark})`,padding:28,borderRadius:4}}>
            <h4 style={{fontFamily:F.h,fontSize:17,fontWeight:700,color:C.white,margin:"0 0 12px"}}>Follow QC Atlantic</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <a href="https://www.linkedin.com/company/quality-car-atlantic/about/" target="_blank" rel="noopener" style={{fontFamily:F.b,fontSize:13.5,color:C.green,textDecoration:"none"}}>LinkedIn →</a>
              <a href="https://www.facebook.com/profile.php?id=61575448862175" target="_blank" rel="noopener" style={{fontFamily:F.b,fontSize:13.5,color:C.green,textDecoration:"none"}}>Facebook →</a>
            </div>
          </div>
        </div></R>
      </div>
    </section>
  </div>);
}

function Footer(){
  return(<footer style={{background:C.dark,padding:"44px 24px 28px",borderTop:`1px solid rgba(0,212,85,.06)`}}>
    <div className="m-pad" style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><Logo size={26} dark/><span style={{fontFamily:F.h,fontSize:15,fontWeight:700,color:C.white}}>QC Atlantic</span></div>
      <div style={{fontFamily:F.b,fontSize:12.5,color:"rgba(255,255,255,.25)"}}>© 2026 Quality Car Atlantic. Clemmons, NC.</div>
      <div style={{fontFamily:F.h,fontSize:14,fontWeight:700,color:C.green,fontStyle:"italic"}}>Chemistry. Not Soap.</div>
    </div>
  </footer>);
}

export default function App(){
  const[currentPage,setCurrentPage]=useState("Home");
  const setPage=p=>{setCurrentPage(p);window.scrollTo({top:0,behavior:"smooth"})};
  const pg=()=>{switch(currentPage){
    case"Home":return<HomePage setPage={setPage}/>;
    case"Products":return<ProductsPage setPage={setPage}/>;
    case"About":return<AboutPage setPage={setPage}/>;
    case"Contact":return<ContactPage/>;
    case"Pay":return<PaymentPage/>;
    default:return<HomePage setPage={setPage}/>;
  }};
  return(<div style={{minHeight:"100vh",background:C.offWhite}}>
    <style>{GCSS}</style>
    <Nav currentPage={currentPage} setPage={setPage}/>
    {pg()}
    <Footer/>
  </div>);
}
