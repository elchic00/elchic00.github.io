// Animated architecture diagram for the Hermes case study. Pure SVG + the
// Tailwind `flow` keyframe: each pulse is a short dash slid along a path drawn
// with pathLength="100". Pulses pass behind nodes, so they read as traffic
// entering and leaving each box. Reduced motion hides the pulses entirely.

const REQUEST_PATH = "M210 56 V72 H121 V276";
const EVAL_PATH = "M36 206 H8 V486 H412 V34 H280";

interface NodeProps {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string;
  dashed?: boolean;
}

const Node = ({ x, y, w, h = 44, title, sub, dashed }: NodeProps) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      className="fill-slate-900 stroke-slate-600"
      strokeDasharray={dashed ? "4 3" : undefined}
    />
    <text
      x={x + w / 2}
      y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
      textAnchor="middle"
      className="fill-white text-[13px] font-bold"
    >
      {title}
    </text>
    {sub && (
      <text x={x + w / 2} y={y + h / 2 + 13} textAnchor="middle" className="fill-slate-400 text-[11px]">
        {sub}
      </text>
    )}
  </g>
);

const Group = ({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} className="fill-slate-950 stroke-slate-700" />
    <text x={x + 14} y={y + 17} className="fill-slate-500 text-[10px] font-bold tracking-widest">
      {label}
    </text>
  </g>
);

const Pulse = ({ d, color, dash, duration, delay = 0 }: { d: string; color: string; dash: number; duration: number; delay?: number }) => (
  <path
    d={d}
    pathLength={100}
    fill="none"
    strokeWidth={3}
    strokeLinecap="round"
    strokeDasharray={`${dash} 300`}
    strokeDashoffset={8}
    filter="url(#hermes-glow)"
    className={`${color} animate-flow motion-reduce:hidden`}
    style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
  />
);

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
        rarely fires. LiteLLM traces every call to Langfuse; a nightly LLM judge scores the traces, a weekly job
        proposes prompt edits, and the proposals return to Telegram for approval.
      </desc>
      <defs>
        <marker id="hermes-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" className="fill-slate-500" />
        </marker>
        {/* userSpaceOnUse: straight segments have a zero-size bbox, which would clip an objectBoundingBox filter */}
        <filter id="hermes-glow" filterUnits="userSpaceOnUse" x={0} y={0} width={420} height={526}>
          <feGaussianBlur stdDeviation={2.5} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
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
        <path d="M336 228 V276" strokeDasharray="4 3" markerEnd="url(#hermes-arrow)" />
      </g>
      <text x={129} y={66} className="fill-slate-400 text-[10px]">chat · cron</text>
      <text x={129} y={258} className="fill-slate-400 text-[10px]">LAN</text>
      <text x={290} y={26} className="fill-slate-400 text-[10px]">
        approve: <tspan className="fill-purple-300 font-mono">apply 1 2</tspan>
      </text>

      <Pulse d={REQUEST_PATH} color="stroke-cyan-400" dash={8} duration={3} />
      <Pulse d={REQUEST_PATH} color="stroke-cyan-400" dash={8} duration={3} delay={1.5} />
      <Pulse d={EVAL_PATH} color="stroke-purple-400" dash={3} duration={8} />

      <Node x={140} y={12} w={140} title="Telegram" sub="you" />
      <Node x={36} y={116} w={170} title="Hermes agent" sub="cron · Telegram bot" />
      <Node x={222} y={116} w={162} title="Obsidian vault" sub="files-first memory" />
      <Node x={36} y={184} w={348} title="LiteLLM gateway" sub="routing · fallback · tracing" />
      <Node x={36} y={300} w={204} h={30} title="Qwen 27B · agentic text" />
      <Node x={36} y={340} w={204} h={30} title="Qwen3-VL-8B · vision" />
      <Node x={36} y={380} w={204} h={30} title="WhisperX · voice notes" />
      <Node x={272} y={276} w={128} h={56} title="Cloud fallback" sub="Kimi → OpenRouter" dashed />
      <Node x={272} y={370} w={128} h={56} title="Raspberry Pi" sub="monitoring" />
      <Node x={20} y={462} w={116} h={48} title="Langfuse" sub="every call traced" />
      <Node x={152} y={462} w={116} h={48} title="LLM judge" sub="nightly scores" />
      <Node x={284} y={462} w={116} h={48} title="Prompt edits" sub="weekly, proposed" />
    </svg>
    <figcaption className="mt-4 text-[13px] leading-relaxed text-slate-400">
      <span className="font-bold text-cyan-300">Cyan</span> is the request path: everything reasons on
      local hardware. <span className="font-bold text-purple-300">Purple</span> is the eval loop: traces get
      scored nightly, and prompt edits are proposed weekly and only land after I approve them in Telegram.
      The dashed cloud fallback exists for local outages and almost never fires.
    </figcaption>
  </figure>
);

export default HermesArchitectureDiagram;
