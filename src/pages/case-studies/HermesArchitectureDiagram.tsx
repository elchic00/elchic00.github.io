// Animated architecture diagram for the Hermes case study. See DiagramParts
// for how the pulses work.

import { GlowFilter, Group, Node, Pulse } from "./DiagramParts";

const REQUEST_PATH = "M210 56 V72 H121 V276";
const EVAL_PATH = "M36 206 H8 V486 H412 V34 H280";
// Tool calls from Hermes skills to the Pi, down the lane right of the fallback box
const TOOL_PATH = "M190 160 V170 H392 V398 H384";

const HermesArchitectureDiagram = () => (
  <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
    <svg
      viewBox="0 0 420 526"
      role="img"
      aria-labelledby="hermes-diagram-title hermes-diagram-desc"
      className="mx-auto block w-full max-w-lg font-sans"
    >
      <title id="hermes-diagram-title">Hermes architecture</title>
      <desc id="hermes-diagram-desc">
        Requests from Telegram and cron go to the Hermes agent on the Mac Mini, which reads an Obsidian
        vault for memory and sends every model call through LiteLLM over the LAN to the Framework Desktop,
        which serves Qwen 27B, Qwen3-VL-8B and WhisperX. A cloud fallback of Kimi then OpenRouter exists but
        rarely fires. Hermes's search and crawl skills call SearXNG and Crawl4AI on a Raspberry Pi. LiteLLM traces every call to Langfuse; a nightly LLM judge scores the traces, a weekly job
        proposes prompt edits, and the proposals return to Telegram for approval.
      </desc>
      <defs>
        <marker id="hermes-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" className="fill-slate-500" />
        </marker>
        <GlowFilter id="hermes-glow" width={420} height={526} />
      </defs>

      <Group x={20} y={88} w={380} h={156} label="MAC MINI · ORCHESTRATOR" />
      <Group x={20} y={276} w={236} h={150} label="FRAMEWORK DESKTOP · GPU" />
      <text x={20} y={454} className="fill-slate-500 text-[10px] font-bold tracking-widest">
        EVAL LOOP · NIGHTLY + WEEKLY
      </text>

      {/* Static edges */}
      <g fill="none" className="stroke-slate-600" strokeWidth={1.5}>
        <path d={REQUEST_PATH} markerEnd="url(#hermes-arrow)" />
        <path d={EVAL_PATH} markerEnd="url(#hermes-arrow)" />
        <path d="M206 138 H222" />
        <path d="M328 228 V276" strokeDasharray="4 3" markerEnd="url(#hermes-arrow)" />
        <path d={TOOL_PATH} markerEnd="url(#hermes-arrow)" />
      </g>
      <text x={129} y={66} className="fill-slate-400 text-[10px]">chat · cron</text>
      <text x={129} y={258} className="fill-slate-400 text-[10px]">LAN</text>
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
      <Node x={36} y={300} w={204} h={30} title="Qwen 27B · agentic text" />
      <Node x={36} y={340} w={204} h={30} title="Qwen3-VL-8B · vision" />
      <Node x={36} y={380} w={204} h={30} title="WhisperX · voice notes" />
      <Node x={272} y={276} w={112} h={56} title="Cloud fallback" sub="Kimi → OpenRouter" dashed />
      <Node x={272} y={370} w={112} h={56} title="Raspberry Pi" sub="SearXNG · Crawl4AI" />
      <Node x={20} y={462} w={116} h={48} title="Langfuse" sub="every call traced" />
      <Node x={152} y={462} w={116} h={48} title="LLM judge" sub="nightly scores" />
      <Node x={284} y={462} w={116} h={48} title="Prompt edits" sub="weekly, proposed" />
    </svg>
    <figcaption className="mt-4 text-[13px] leading-relaxed text-slate-400">
      <span className="font-bold text-cyan-300">Cyan</span> is the request path: everything reasons on
      local hardware. <span className="font-bold text-amber-300">Amber</span> is tool traffic: Hermes's
      search and crawl skills call SearXNG and Crawl4AI on the Pi. <span className="font-bold text-purple-300">Purple</span> is the eval loop: traces get
      scored nightly, and prompt edits are proposed weekly and only land after I approve them in Telegram.
      The dashed cloud fallback exists for local outages and almost never fires.
    </figcaption>
  </figure>
);

export default HermesArchitectureDiagram;
