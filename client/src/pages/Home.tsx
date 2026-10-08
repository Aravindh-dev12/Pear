import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, AudioLines, BrainCircuit, Check, ChevronDown, Database, Github, LockKeyhole, Menu, Mic, Monitor, Network, Search, ShieldCheck, Sparkles, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; eyebrow: string; title: string; copy: string }[] = [
  { icon: Mic, eyebrow: "CAPTURE", title: "Record the whole conversation.", copy: "Capture microphone, system audio, imports, and live input in one private workspace. Keep both sides of a call in sync." },
  { icon: AudioLines, eyebrow: "TRANSCRIBE", title: "Turn speech into a usable transcript.", copy: "Choose separate live and final transcription engines, preserve timestamps, and keep the raw conversation available for review." },
  { icon: Users, eyebrow: "UNDERSTAND", title: "Know who said what.", copy: "Diarize speakers, rename them, save voice samples, and match identities across meetings without sending recordings to a hosted service." },
  { icon: BrainCircuit, eyebrow: "ANALYZE", title: "Make every meeting searchable.", copy: "Create structured AI notes, exact keyword search, hybrid RAG, and grounded answers that point back to the original meeting evidence." },
];

const principles = [
  ["01", "Local by default", "Recordings, transcripts, model files, and application data stay under your control."],
  ["02", "Modular AI", "Transcription, diarization, voice matching, retrieval, and analysis are independent stages."],
  ["03", "Traceable answers", "Meeting IDs, timestamps, speakers, and source excerpts keep AI output grounded."],
  ["04", "Open architecture", "A bounded local MCP server connects your meeting library to compatible desktop AI clients."],
];

const faqs = [
  ["Is Oundnote cloud based?", "No. Oundnote is designed as a local-first, self-hosted meeting assistant. Your recordings, transcripts, model files, and application data remain on your computer unless you deliberately connect an external service or integration."],
  ["Can it record video calls?", "Yes. Capture microphone and system audio together so your voice and the other participants can be transcribed from one synchronized local recording. Platform-specific audio capture is documented for Windows, macOS, and Linux."],
  ["What can I do with an old meeting?", "Search exact terms, search by meaning with hybrid retrieval, inspect timestamps and speakers, read AI notes, or ask a compatible desktop AI client to retrieve grounded evidence from the meeting library."],
  ["Does Oundnote require one specific AI model?", "No. The processing pipeline is intentionally modular. Live transcription, final transcription, diarization, saved-voice matching, embeddings, and analysis can use separate engines and model choices."],
  ["What is the MCP server?", "It is a read-only local bridge for Claude Desktop, ChatGPT Desktop, Codex, and compatible MCP clients. It exposes bounded meeting knowledge without giving the client direct access to the database, recordings, settings, or filesystem."],
];

function Kicker({ children }: { children: string }) { return <span className="kicker">{children}</span>; }
function FeatureCard({ item }: { item: typeof features[number] }) {
  const Icon = item.icon;
  return <article className="feature-card"><div className="feature-icon"><Icon size={19}/></div><Kicker>{item.eyebrow}</Kicker><h3>{item.title}</h3><p>{item.copy}</p><ArrowRight className="feature-arrow" size={16}/></article>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [pointer, setPointer] = useState({x:0,y:0});

  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    const move = (e: PointerEvent) => setPointer({ x: e.clientX / Math.max(innerWidth,1) - .5, y: e.clientY / Math.max(innerHeight,1) - .5 });
    scroll(); addEventListener("scroll", scroll, {passive:true}); addEventListener("pointermove", move, {passive:true});
    return () => { removeEventListener("scroll", scroll); removeEventListener("pointermove", move); };
  }, []);

  const go = (id: string) => { setMenu(false); document.querySelector(id)?.scrollIntoView({behavior:"smooth"}); };
  const style = {"--px": `${pointer.x*18}px`, "--py": `${pointer.y*12}px`} as CSSProperties;

  return <main className="oundnote-site" style={style}>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className={`topbar ${scrolled ? "scrolled" : ""}`}>
      <button className="wordmark" onClick={()=>go("#top")}><span className="mark"><AudioLines size={16}/></span>OUNDNOTE</button>
      <nav><button onClick={()=>go("#capabilities")}>CAPABILITIES</button><button onClick={()=>go("#privacy")}>PRIVACY</button><button onClick={()=>go("#mcp")}>MCP</button><button onClick={()=>go("#faq")}>FAQ</button></nav>
      <div className="top-actions">
        <a href="https://github.com/Aravindh-dev12/oundnote" target="_blank" rel="noreferrer"><Github size={14}/> GITHUB</a>
        <a className="small-cta" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">GET STARTED <ArrowRight size={13}/></a>
        <button className="menu-button" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu size={19}/></button>
      </div>
    </header>

    <div className={`drawer ${menu ? "open" : ""}`}>
      <div className="drawer-head"><span>OUNDNOTE / MENU</span><button onClick={()=>setMenu(false)}><X size={19}/></button></div>
      {["#capabilities|Capabilities","#privacy|Privacy","#workflow|Workflow","#mcp|Local MCP","#faq|FAQ"].map(v=>{const [id,label]=v.split("|"); return <button className="drawer-link" key={id} onClick={()=>go(id)}>{label}<ArrowRight size={18}/></button>;})}
      <a className="drawer-cta" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">INSTALL OUNDNOTE <ArrowRight size={15}/></a>
    </div>

    <section id="top" className="hero">
      <div className="hero-bg"><div className="orb"/><div className="scan scan-a"/><div className="scan scan-b"/><i className="cross cross-a"/><i className="cross cross-b"/></div>
      <div className="hero-meta"><span>LOCAL AI / MEETING MEMORY</span><span>WINDOWS · macOS · LINUX</span></div>
      <div className="hero-grid-content">
        <div className="hero-copy">
          <Kicker>PRIVATE MEETING INTELLIGENCE</Kicker>
          <h1>Your conversations.<br/><em>Your computer.</em><br/>Your memory.</h1>
          <p>Oundnote records, transcribes, identifies speakers, and turns meetings into searchable knowledge — without handing your conversation archive to a cloud service.</p>
          <div className="actions"><a className="primary" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">INSTALL LOCALLY <ArrowRight size={15}/></a><button className="text-link" onClick={()=>go("#capabilities")}>EXPLORE THE SYSTEM <ArrowRight size={15}/></button></div>
        </div>
        <div className="console">
          <div className="console-head"><span><b/> OUNDNOTE / LIVE</span><span>MEETING_042</span></div>
          <div className="wave">{Array.from({length:48},(_,i)=><i key={i} style={{height:`${18+(i*17)%62}%`}}/>)}</div>
          {[["A","Speaker 01","00:14:32 · We should move this into the next release."],["B","Speaker 02","00:14:41 · Agreed. I’ll own the migration plan."]].map(([letter,name,line],i)=><div className="speaker" key={letter}><span className={`avatar a${i}`}>{letter}</span><div><strong>{name}</strong><small>{line}</small></div></div>)}
          <div className="console-foot"><span><Search size={12}/> HYBRID SEARCH READY</span><span><LockKeyhole size={12}/> LOCAL ONLY</span></div>
        </div>
      </div>
      <div className="hero-foot"><span>OPEN-SOURCE / SELF-HOSTED</span><span>ALPHA / 0.7.1</span><span>SCROLL ↓</span></div>
    </section>

    <section id="capabilities" className="section">
      <div className="heading"><div><Kicker>01 / CAPABILITIES</Kicker><h2>From raw audio<br/>to <em>useful memory.</em></h2></div><p>One local pipeline for capture, transcription, diarization, retrieval, analysis, and the small details that make a meeting archive genuinely useful.</p></div>
      <div className="feature-grid">{features.map(x=><FeatureCard item={x} key={x.title}/>)}</div>
    </section>

    <section id="privacy" className="section privacy">
      <div className="privacy-panel">
        <div className="privacy-visual"><div className="ring r1"/><div className="ring r2"/><div className="core"><ShieldCheck size={32}/></div><span className="orbit o1">AUDIO</span><span className="orbit o2">MODELS</span><span className="orbit o3">NOTES</span><span className="orbit o4">INDEX</span></div>
        <div className="privacy-copy"><Kicker>02 / PRIVACY</Kicker><h2>The archive stays<br/><em>with you.</em></h2><p>Oundnote is built around local ownership. Your recordings, transcripts, models, and meeting data are designed to live on your machine. External integrations are explicit, bounded, and optional.</p><div className="checks">{["Local SQLite workspace","Read-only local MCP access","Explicit integration controls","No cloud account required for core workflows"].map(x=><div key={x}><Check size={14}/>{x}</div>)}</div></div>
      </div>
    </section>

    <section id="workflow" className="section">
      <div className="heading"><div><Kicker>03 / THE WORKFLOW</Kicker><h2>A meeting becomes<br/><em>an interface.</em></h2></div><p>The system is deliberately modular: each stage can be selected, disabled, replaced, or tuned without tying the entire application to one model.</p></div>
      <div className="workflow">{[[Mic,"01","Capture","Microphone + system audio, imports, live meters"],[AudioLines,"02","Transcribe","Live and final engines with timestamps"],[Users,"03","Identify","Speaker turns, names, saved voice matching"],[Database,"04","Index","SQLite, FTS5, embeddings, hybrid retrieval"],[Sparkles,"05","Understand","AI notes, prompts, grounded evidence"]].map(([I,n,t,c])=>{const Icon=I as LucideIcon; return <div className="step" key={String(n)}><span>{n}</span><div><Icon size={18}/></div><h3>{t}</h3><p>{c}</p></div>})}</div>
    </section>

    <section id="mcp" className="section mcp">
      <div className="mcp-copy"><Kicker>04 / LOCAL MCP</Kicker><h2>Make your meeting<br/><em>memory available to AI.</em></h2><p>Connect Claude Desktop, ChatGPT Desktop, Codex, and compatible MCP clients to the completed meetings already on your computer. Ask questions naturally while keeping the source database and recordings behind a bounded local API.</p><a className="primary" href="https://github.com/Aravindh-dev12/oundnote/blob/main/docs/mcp.md" target="_blank" rel="noreferrer">READ THE MCP GUIDE <ArrowRight size={15}/></a></div>
      <div className="diagram"><div className="d-box"><Monitor size={19}/><span>DESKTOP AI</span><small>Claude / ChatGPT / Codex</small></div><div className="connector"/><div className="d-box mid"><Network size={18}/><span>MCP</span><small>READ ONLY</small></div><div className="connector"/><div className="d-box core-box"><Database size={20}/><span>OUNDNOTE</span><small>LOCAL KNOWLEDGE</small></div><small className="caption"><LockKeyhole size={12}/> LOOPBACK / BOUNDED ACCESS / SOURCE PROVENANCE</small></div>
    </section>

    <section className="section principles"><div className="principles-intro"><Kicker>05 / PRINCIPLES</Kicker><h2>Built around<br/><em>control.</em></h2></div><div className="principles-list">{principles.map(x=><div className="principle" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><p>{x[2]}</p></div>)}</div></section>

    <section id="faq" className="section faq"><div><Kicker>06 / FAQ</Kicker><h2>The short<br/><em>version.</em></h2></div><div className="faq-list">{faqs.map(([q,a],i)=>{const open=faq===i; return <div className={`faq-item ${open?"open":""}`} key={q}><button onClick={()=>setFaq(open?-1:i)} aria-expanded={open}><span>{q}</span><ChevronDown size={18}/></button><div className="answer"><p>{a}</p></div></div>})}</div></section>

    <section className="final"><div className="final-grid"/><div><Kicker>07 / START HERE</Kicker><h2>Keep the conversation.<br/><em>Keep the memory.</em></h2><p>Explore the source, install Oundnote locally, and build your own private meeting knowledge base.</p><div className="actions center"><a className="primary" href="https://github.com/Aravindh-dev12/oundnote#installation" target="_blank" rel="noreferrer">GET OUNDNOTE <ArrowRight size={15}/></a><a className="text-link" href="https://oundnote.eu" target="_blank" rel="noreferrer">OUNDNOTE.EU <ArrowRight size={15}/></a></div></div></section>

    <footer><span className="footer-brand"><span className="mark"><AudioLines size={14}/></span> OUNDNOTE</span><span>PRIVATE AI MEETING MEMORY</span><a href="https://github.com/Aravindh-dev12/oundnote" target="_blank" rel="noreferrer"><Github size={13}/> SOURCE</a><span>© 2026</span></footer>
  </main>;
}
