/**
 * Quick action chips for common navigation tasks
 */

import { BriefcaseIcon, DocumentTextIcon, LightningBoltIcon, MailIcon } from "@heroicons/react/solid";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QUICK_ACTIONS = [
  { Icon: LightningBoltIcon, label: "Projects", action: "view_projects" },
  { Icon: DocumentTextIcon, label: "Resume", action: "view_resume" },
  { Icon: BriefcaseIcon, label: "Experience", action: "view_experience" },
  { Icon: MailIcon, label: "Contact", action: "contact_form" },
];

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Quick Actions</p>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.action}
            onClick={() => onActionClick(action.action)}
            className="flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 px-3 py-2.5 text-sm text-slate-200 transition-all hover:scale-[1.02] hover:from-cyan-600/30 hover:to-purple-600/30 active:scale-95 focus-ring"
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
