/**
 * Quick action chips for common navigation tasks
 */

import { BriefcaseIcon, LightningBoltIcon, MailIcon, PuzzleIcon } from "@heroicons/react/solid";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QUICK_ACTIONS = [
  { Icon: LightningBoltIcon, label: "Projects", action: "view_projects" },
  { Icon: BriefcaseIcon, label: "Travel", action: "view_travel" },
  { Icon: PuzzleIcon, label: "Play Snake", action: "play_snake" },
  { Icon: MailIcon, label: "Contact", action: "contact_form" },
];

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Quick Actions</p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.action}
            onClick={() => onActionClick(action.action)}
            className="flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border border-cyan-500/30 text-slate-200 py-3 px-3 rounded-lg transition-all hover:scale-[1.02] active:scale-95 focus-ring min-h-[44px]"
            aria-label={action.label}
          >
            <action.Icon className="w-5 h-5 text-cyan-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
