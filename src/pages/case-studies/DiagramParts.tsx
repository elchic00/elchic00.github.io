// Shared SVG pieces for the animated case-study diagrams. A pulse is a short
// dash slid along a path drawn with pathLength="100" (Tailwind `flow` keyframe);
// pulses pass behind nodes, so they read as traffic entering and leaving each
// box. Reduced motion hides the pulses and leaves the static diagram.

interface NodeProps {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string;
  dashed?: boolean;
  /** Left-align the labels, leaving room for paths that run through the box's left edge */
  textX?: number;
}

export const Node = ({ x, y, w, h = 44, title, sub, dashed, textX }: NodeProps) => {
  const tx = textX ?? x + w / 2;
  const anchor = textX === undefined ? "middle" : "start";
  return (
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
        x={tx}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor={anchor}
        className="fill-white text-[13px] font-bold"
      >
        {title}
      </text>
      {sub && (
        <text x={tx} y={y + h / 2 + 13} textAnchor={anchor} className="fill-slate-400 text-[11px]">
          {sub}
        </text>
      )}
    </g>
  );
};

export const Group = ({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={12} className="fill-slate-950 stroke-slate-700" />
    <text x={x + 14} y={y + 17} className="fill-slate-500 text-[10px] font-bold tracking-widest">
      {label}
    </text>
  </g>
);

// userSpaceOnUse: straight segments have a zero-size bbox, which would clip an objectBoundingBox filter
export const GlowFilter = ({ id, width, height }: { id: string; width: number; height: number }) => (
  <filter id={id} filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
    <feGaussianBlur stdDeviation={2.5} result="blur" />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

export const Pulse = ({
  d,
  color,
  dash,
  duration,
  delay = 0,
  filterId,
}: {
  d: string;
  color: string;
  dash: number;
  duration: number;
  delay?: number;
  filterId: string;
}) => (
  <path
    d={d}
    pathLength={100}
    fill="none"
    strokeWidth={3}
    strokeLinecap="round"
    strokeDasharray={`${dash} 300`}
    strokeDashoffset={8}
    filter={`url(#${filterId})`}
    className={`${color} animate-flow motion-reduce:hidden`}
    style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
  />
);
