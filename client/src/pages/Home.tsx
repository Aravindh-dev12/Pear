import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, AudioLines, Github, Menu, X, Zap, Shield, Radio, BrainCircuit, Search, ChevronDown } from "lucide-react";

function WebGPUField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let dead = false, raf = 0;
    const canvas = ref.current;
    if (!canvas) return;
    const run = async () => {
      const gpu = (navigator as any).gpu;
      if (!gpu) return;
      const adapter = await gpu.requestAdapter();
      const device = await adapter?.requestDevice();
      if (!device || dead) return;
      const ctx = canvas.getContext("webgpu") as any;
      if (!ctx) return;
      const format = gpu.getPreferredCanvasFormat();
      ctx.configure({ device, format, alphaMode: "premultiplied" });
      const shaderCode = [
        "struct U { t:f32, aspect:f32, mx:f32, my:f32 };",
        "@group(0) @binding(0) var<uniform> u:U;",
        "@vertex fn vs(@builtin(vertex_index) i:u32)->@builtin(position) vec4<f32>{ var p=array<vec2<f32>,3>(vec2<f32>(-1.,-1.),vec2<f32>(3.,-1.),vec2<f32>(-1.,3.)); return vec4<f32>(p[i],0.,1.); }",
        "fn hash(p:vec2<f32>)->f32{ return fract(sin(dot(p,vec2<f32>(127.1,311.7)))*43758.5453); }",
        "@fragment fn fs(@builtin(position) p:vec4<f32>)->@location(0) vec4<f32>{",
        "var uv=(p.xy/vec2<f32>(800.,800.))-.5; uv.x*=u.aspect;",
        "let t=u.t*.12; var col=vec3<f32>(0.);",
        "for(var i:f32=1.;i<7.;i+=1.){ let a=atan2(uv.y,uv.x)+sin(t+i)*.12; let r=length(uv); let wave=abs(r-(.12*i+.035*sin(a*5.+t*i)*.018)); let glow=.0025/max(wave,.001); col+=vec3<f32>(.72,.76,.78)*glow*(.25+hash(vec2<f32>(i,i*3.1))); }",
        "let beam=exp(-abs(uv.y-sin(uv.x*3.+t)*.035)*90.); col+=vec3<f32>(.55,.58,.6)*beam*.035;",
        "let vignette=1.-smoothstep(.2,.78,length(uv)); return vec4<f32>(col*vignette,.92); }"
      ].join("\n");
      const shader = device.createShaderModule({code:shaderCode});
      const pipe = device.createRenderPipeline({layout:"auto",vertex:{module:shader,entryPoint:"vs"},fragment:{module:shader,entryPoint:"fs",targets:[{format}]},primitive:{topology:"triangle-list"}});
      const buf=device.createBuffer({size:16,usage:(GPUBufferUsage as any).UNIFORM|(GPUBufferUsage as any).COPY_DST});
      const bind=device.createBindGroup({layout:pipe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:buf}}]});
      const start=performance.now();
      const resize=()=>{const d=Math.min(devicePixelRatio,2); canvas.width=innerWidth*d; canvas.height=innerHeight*d; canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px";};
      resize(); addEventListener("resize",resize);
      const frame=()=>{if(dead)return; const t=(performance.now()-start)/1000; const arr=new Float32Array([t,innerWidth/innerHeight,0,0]); device.queue.writeBuffer(buf,0,arr); const enc=device.createCommandEncoder(); const pass=enc.beginRenderPass({colorAttachments:[{view:ctx.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]}); pass.setPipeline(pipe); pass.setBindGroup(0,bind); pass.draw(3); pass.end(); device.queue.submit([enc.finish()]); raf=requestAnimationFrame(frame);};
      frame();
      return ()=>removeEventListener("resize",resize);
    };
    run();
    return ()=>{dead=true; cancelAnimationFrame(raf)};
  },[]);
  return <canvas ref={ref} className="gpu-field" aria-hidden="true"/>;
}

const items=[["01","Capture","Microphone + system audio become one synchronized source."],["02","Transcribe","Live and final transcription preserve searchable timestamps."],["03","Understand","Speaker diarization, voice matching and structured notes."],["04","Retrieve","FTS5, embeddings and hybrid RAG surface exact evidence."]];
const faqs=[["Is Oundnote local?","Yes. The core workflow is designed for local, self-hosted use. Recordings, transcripts, model files and application data stay on your machine unless you explicitly add an external integration."],["What makes the MCP layer different?","Oundnote exposes bounded, read-only meeting knowledge to compatible desktop AI clients. The client does not get direct access to your database, recordings or filesystem."],["Can I search old meetings?","Yes. Search exact terms or semantic meaning, inspect speakers and timestamps, and use grounded AI notes to move from a question back to the original evidence."]];
export default function Home(){
 const [menu,setMenu]=useState(false); const [faq,setFaq]=useState(0);
 const go=(id:string)=>{setMenu(false);document.querySelector(id)?.scrollIntoView({behavior:"smooth"})};
 return <main className="black-site"><WebGPUField/><div className="noise"/>
  <header className="nav"><button className="brand" onClick={()=>go("#top")}><span><AudioLines size={15}/></span>OUNDNOTE</button><nav><button onClick={()=>go("#system")}>SYSTEM</button><button onClick={()=>go("#privacy")}>PRIVACY</button><button onClick={()=>go("#mcp")}>MCP</button><button onClick={()=>go("#faq")}>FAQ</button></nav><div className="nav-right"><a href="https://github.com/Aravindh-dev12/oundnote" target="_blank" rel="noreferrer"><Github size={14}/> SOURCE</a><a className="nav-cta" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">INSTALL <ArrowUpRight size={13}/></a><button className="mobile-menu" onClick={()=>setMenu(true)}><Menu size={19}/></button></div></header>
  <aside className={`mobile-drawer ${menu?"show":""}`}><button onClick={()=>setMenu(false)}><X/></button>{["#system","#privacy","#mcp","#faq"].map((x,i)=><button key={x} onClick={()=>go(x)}>{["SYSTEM","PRIVACY","MCP","FAQ"][i]} <ArrowUpRight size={16}/></button>)}</aside>
  <section id="top" className="hero2"><div className="eyebrow"><span/> LOCAL AI / MEETING MEMORY / WEBGPU</div><div className="hero-title"><h1>MEETINGS<br/><i>REMEMBERED.</i></h1><div className="hero-side"><p>Oundnote turns conversations into private, searchable intelligence — directly on your machine.</p><div><a className="black-button" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">START LOCALLY <ArrowUpRight size={15}/></a><button className="line-button" onClick={()=>go("#system")}>SEE THE SYSTEM</button></div></div></div><div className="hero-bottom"><span>01 — PRIVATE BY DESIGN</span><span>02 — OPEN SOURCE</span><span>03 — LOCAL AI</span><span className="scroll">SCROLL TO EXPLORE ↓</span></div></section>
  <section id="system" className="dark-section"><div className="section-label">01 / THE SYSTEM</div><div className="split-title"><h2>RAW AUDIO<br/><i>IN.</i><br/>USEFUL MEMORY<br/><i>OUT.</i></h2><p>One composable pipeline for capture, transcription, speaker identity, indexing and grounded AI analysis. No cloud dashboard required.</p></div><div className="system-grid">{items.map(([n,t,c])=><article key={n}><span>{n}</span><div className="glyph">{n==="01"?<Radio/>:n==="02"?<Zap/>:n==="03"?<BrainCircuit/>:<Search/>}</div><h3>{t}</h3><p>{c}</p><ArrowUpRight className="card-arrow"/></article>)}</div></section>
  <section id="privacy" className="black-section"><div className="privacy-orbit"><div className="orbit-ring one"/><div className="orbit-ring two"/><div className="orbit-core"><Shield size={28}/><span>LOCAL</span></div></div><div className="privacy-copy"><div className="section-label">02 / PRIVACY</div><h2>THE CLOUD<br/><i>DOESN'T</i><br/>GET THE<br/>CONVERSATION.</h2><p>Oundnote is designed around ownership. Your archive lives where you work. External services are optional, explicit and bounded.</p><div className="privacy-points"><span>LOCAL SQLITE</span><span>READ-ONLY MCP</span><span>NO REQUIRED ACCOUNT</span><span>YOUR MODELS</span></div></div></section>
  <section id="mcp" className="dark-section mcp2"><div className="section-label">03 / MCP</div><div className="mcp-layout"><div><h2>ASK YOUR<br/><i>MEETINGS.</i></h2><p>Connect Claude Desktop, ChatGPT Desktop, Codex and compatible MCP clients to the meeting knowledge already on your computer.</p><a className="black-button" href="https://github.com/Aravindh-dev12/oundnote/blob/main/docs/mcp.md" target="_blank" rel="noreferrer">READ MCP GUIDE <ArrowUpRight size={15}/></a></div><div className="mcp-diagram"><div>DESKTOP AI</div><span>↓</span><div>MCP / READ ONLY</div><span>↓</span><div className="active">OUNDNOTE / LOCAL MEMORY</div><small>LOOPBACK · BOUNDED ACCESS · SOURCE PROVENANCE</small></div></div></section>
  <section id="faq" className="dark-section faq2"><div className="section-label">04 / FAQ</div><h2>NO MYSTERY.<br/><i>JUST MEMORY.</i></h2><div className="faq-list">{faqs.map(([q,a],i)=><div className={faq===i?"faq-open":""} key={q}><button onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span><ChevronDown/></button><p>{a}</p></div>)}</div></section>
  <section className="closing"><div className="closing-mark">O</div><div className="section-label">05 / OUNDNOTE</div><h2>KEEP THE<br/><i>MEMORY.</i></h2><a className="black-button" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">GET OUNDNOTE <ArrowUpRight size={15}/></a></section>
  <footer><span>OUNDNOTE / LOCAL AI MEETING MEMORY</span><a href="https://github.com/Aravindh-dev12/oundnote" target="_blank" rel="noreferrer">GITHUB ↗</a><span>© 2026</span></footer>
 </main>
}
