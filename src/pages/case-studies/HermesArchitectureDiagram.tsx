// Animated architecture diagram for the Hermes case study. See DiagramParts
// for how the pulses work.

import { GlowFilter, Group, Node, Pulse } from "./DiagramParts";

const REQUEST_PATH = "M210 56 V72 H121 V288";
const EVAL_PATH = "M36 206 H8 V498 H412 V34 H280";
// Tool calls from Hermes skills to the Pi, down the lane at the right edge
const TOOL_PATH = "M190 160 V170 H392 V332 H384";
// Fallback runs down the gap between the Framework and Pi boxes
const FALLBACK_PATH = "M256 228 V413 H264";

// The three machines hang off one wired LAN band; arrows that cross it cross the network
const LAN_TOP = 254;
const LAN_BOTTOM = 274;

const HermesArchitectureDiagram = () => (
  <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
    <svg
      viewBox="0 0 420 538"
      role="img"
      aria-labelledby="hermes-diagram-title hermes-diagram-desc"
      className="mx-auto block w-full max-w-lg font-sans"
    >
      <title id="hermes-diagram-title">Hermes architecture</title>
      <desc id="hermes-diagram-desc">
        Three machines share one wired LAN through an ethernet switch: a Mac Mini, a Framework Desktop, and a
        Raspberry Pi. Requests from Telegram and cron go to the Hermes agent on the Mac Mini, which reads an
        Obsidian vault for memory and sends every model call through LiteLLM across the LAN to the Framework
        Desktop, which serves Qwen 27B, Qwen3-VL-8B and WhisperX. Hermes's search and crawl skills call SearXNG
        and Crawl4AI on the Pi. A cloud fallback of Kimi then OpenRouter exists but rarely fires. LiteLLM traces
        every call to Langfuse; a nightly LLM judge scores the traces, a weekly job proposes prompt edits, and
        the proposals return to Telegram for approval.
      </desc>
      <defs>
        <marker id="hermes-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" className="fill-slate-500" />
        </marker>
        <GlowFilter id="hermes-glow" width={420} height={538} />
      </defs>

      <Group x={20} y={88} w={380} h={156} label="MAC MINI · ORCHESTRATOR" />
      <Group x={20} y={288} w={228} h={150} label="FRAMEWORK DESKTOP · GPU" />
      <Group x={264} y={288} w={120} h={88} label="RASPBERRY PI" />

      {/* LAN band, with each machine's cable into it */}
      <rect x={20} y={LAN_TOP} width={380} height={LAN_BOTTOM - LAN_TOP} rx={10} className="fill-slate-800 stroke-slate-600" />
      <text x={127} y={267} className="fill-slate-400 text-[9px] font-bold tracking-wide">
        LAN · ETHERNET SWITCH
      </text>
      <g className="stroke-slate-500" strokeWidth={3} strokeLinecap="round">
        <path d={`M48 244 V${LAN_TOP}`} />
        <path d={`M48 ${LAN_BOTTOM} V288`} />
        <path d={`M372 ${LAN_BOTTOM} V288`} />
      </g>

      <text x={20} y={466} className="fill-slate-500 text-[10px] font-bold tracking-widest">
        EVAL LOOP · NIGHTLY + WEEKLY
      </text>

      {/* Static edges */}
      <g fill="none" className="stroke-slate-600" strokeWidth={1.5}>
        <path d={REQUEST_PATH} markerEnd="url(#hermes-arrow)" />
        <path d={EVAL_PATH} markerEnd="url(#hermes-arrow)" />
        <path d="M206 138 H222" />
        <path d={FALLBACK_PATH} strokeDasharray="4 3" markerEnd="url(#hermes-arrow)" />
        <path d={TOOL_PATH} markerEnd="url(#hermes-arrow)" />
      </g>
      <text x={129} y={66} className="fill-slate-400 text-[10px]">chat · cron</text>
      <text x={226} y={181} className="fill-slate-400 text-[10px]">skills: search · crawl</text>
      <text x={290} y={26} className="fill-slate-400 text-[10px]">
        approve: <tspan className="fill-purple-300 font-mono">apply 1 2</tspan>
      </text>

      <Pulse filterId="hermes-glow" d={REQUEST_PATH} color="stroke-cyan-400" dash={8} duration={3} />
      <Pulse filterId="hermes-glow" d={REQUEST_PATH} color="stroke-cyan-400" dash={8} duration={3} delay={1.5} />
      <Pulse filterId="hermes-glow" d={EVAL_PATH} color="stroke-purple-400" dash={3} duration={8} />
      <Pulse filterId="hermes-glow" d={TOOL_PATH} color="stroke-amber-400" dash={7} duration={4} delay={0.8} />

      <Node x={140} y={12} w={140} title="Telegram" sub="you" />
      <Node x={36} y={116} w={170} title="Hermes agent" sub="cron · Telegram bot" />
      <Node x={222} y={116} w={162} title="Obsidian vault" sub="files-first memory" />
      <Node x={36} y={184} w={348} title="LiteLLM gateway" sub="routing · fallback · tracing" />
      <Node x={36} y={312} w={196} h={30} title="Qwen 27B · agentic text" />
      <Node x={36} y={352} w={196} h={30} title="Qwen3-VL-8B · vision" />
      <Node x={36} y={392} w={196} h={30} title="WhisperX · voice notes" />
      <Node x={272} y={312} w={104} h={26} title="SearXNG" />
      <Node x={272} y={344} w={104} h={26} title="Crawl4AI" />
      <Node x={264} y={388} w={120} h={50} title="Cloud fallback" sub="Kimi → OpenRouter" dashed />
      <Node x={20} y={474} w={116} h={48} title="Langfuse" sub="every call traced" />
      <Node x={152} y={474} w={116} h={48} title="LLM judge" sub="nightly scores" />
      <Node x={284} y={474} w={116} h={48} title="Prompt edits" sub="weekly, proposed" />
    </svg>
    <figcaption className="mt-4 text-[13px] leading-relaxed text-slate-400">
      The three machines share one wired LAN through an ethernet switch, so any arrow crossing the band
      crosses the network. <span className="font-bold text-cyan-300">Cyan</span> is the request path:
      everything reasons on local hardware. <span className="font-bold text-amber-300">Amber</span> is tool
      traffic: Hermes's search and crawl skills call SearXNG and Crawl4AI on the Pi.{" "}
      <span className="font-bold text-purple-300">Purple</span> is the eval loop: traces get scored nightly,
      and prompt edits are proposed weekly and only land after I approve them in Telegram. The dashed cloud
      fallback exists for local outages and almost never fires.
    </figcaption>
  </figure>
);

export default HermesArchitectureDiagram;
