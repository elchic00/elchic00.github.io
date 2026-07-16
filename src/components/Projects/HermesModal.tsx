import React from "react";
import {
  ServerIcon, BeakerIcon, ShieldCheckIcon, MicrophoneIcon, LightBulbIcon, ChipIcon
} from "@heroicons/react/solid";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

interface HermesModalProps { isOpen: boolean; onClose: () => void; }

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-cyan-500/10 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export const HermesModal: React.FC<HermesModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="Hermes project details">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/hermes.svg" alt="Diagram: 11 conversation turns scored below quality threshold are grouped into 3 clusters, producing 3 proposed prompt edits sent to Telegram for approval — 2 applied, 1 correctly rejected as a bad fit" className="w-full h-full object-contain bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full border border-amber-500/30">3-Node Homelab</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Built on Nous Research's hermes-agent</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Hermes: Self-Hosted, Self-Graded, Never Unsupervised</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">hermes-agent is the open-source harness — the eval loop, the infra, and the HITL gates are what I built around it</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* Architecture Overview */}
        <SectionCard icon={<ChipIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            None of this started as a plan — a Mac Mini for a new desktop, a Raspberry Pi to stop paying for SaaS,
            then an inference box to wire it all together, and at some point three unrelated purchases became a
            homelab running my own AI agents. It's not a demo account either: voice memos become structured notes
            before I've put my phone away, and none of it needs me checking in on it manually. The agent runtime
            itself — <strong className="text-white">hermes-agent</strong> — is Nous Research's
            open-source harness (MIT-licensed). I didn't write it; I deployed it, and I built the observability and
            safety layer around it. It ships with cloud providers built in — Nous Portal, OpenRouter, OpenAI.
            Local is the default: every routine model call goes through LiteLLM to models I patched and serve myself
            (see the Inference Engine card for that half of the story). Cloud is a deliberate fallback, not an
            afterthought — for anything sensitive, or when local hits its usage limit. Three machines, three jobs: a <strong className="text-white">Mac Mini M4</strong> runs
            the orchestrator, cron scheduler, and Telegram bot; reasoning routes over the LAN to
            the <strong className="text-white">Framework Desktop</strong>, the hand-patched local inference engine
            this platform actually runs on; a <strong className="text-white">Raspberry Pi 5</strong> handles network
            exit and a handful of agent-callable services. The Mac Mini has only 16GB of RAM — it can't host a
            capable model itself, so every call crosses the network to where the GPU actually is.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">3</div>
              <div className="text-slate-400 text-xs">Nodes</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">Nightly</div>
              <div className="text-slate-400 text-xs">Eval Scoring</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">Weekly</div>
              <div className="text-slate-400 text-xs">Self-Improvement Run</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-emerald-400 font-mono text-lg font-bold">$0</div>
              <div className="text-slate-400 text-xs">Marginal Cost / Call</div>
            </div>
          </div>
        </SectionCard>

        {/* Eval loop - the concrete real run */}
        <SectionCard icon={<BeakerIcon className="h-5 w-5 text-cyan-400" />} title="The Eval Loop">
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            This part is mine, not the harness's: a cron job I wrote that pulls every conversation's execution trace
            from <strong className="text-white">Langfuse</strong> and has an LLM judge score it nightly on task
            completion, tool-call efficiency, and response quality. Once a week, a second job I built pulls the last
            30 days of low-scoring turns, clusters them by theme, and proposes specific edits to the agent's own
            system prompt — sent to Telegram, never applied automatically.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            One real run: <strong className="text-white">11 low-quality turns</strong> clustered
            into <strong className="text-white">3 patterns</strong>, producing <strong className="text-white">3 proposed edits</strong>.
            Two were approved and landed in the prompt — <em>"lead with the answer"</em> and <em>"complete every action
            chain, no preamble-only turns."</em> The third was rejected: every turn in that cluster turned out to be an
            automated cron delivery, where the proposed fix didn't actually apply. The loop found a real pattern and
            recommended the wrong fix for it — catching that is the point of keeping a human in it.
          </p>
        </SectionCard>

        {/* HITL + account isolation */}
        <SectionCard icon={<ShieldCheckIcon className="h-5 w-5 text-cyan-400" />} title="Trust Boundaries">
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Every side-effecting action — an outreach email, a prompt patch, anything that leaves the system — follows
            the same shape: draft written to disk in a pending-review state, a Telegram prompt to the operator, a
            dry-run shown on approval, then an explicit confirm before it's real. No silent outbound actions,
            anywhere in the platform. It's the trust pattern enterprises actually require before they'll let an agent
            touch anything that matters.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Hermes and every local model it runs also sit under a separate, low-privileged macOS account from mine —
            not for organization, for containment. If a model is manipulated by something it reads — a webpage, a
            file, a prompt injection — the damage stops at that account; it can't pivot into my admin login or the
            rest of the machine. The access only goes one direction: I can reach into the agent's world any time, it
            can never reach back into mine.
          </p>
        </SectionCard>

        {/* Voice Relay */}
        <SectionCard icon={<MicrophoneIcon className="h-5 w-5 text-cyan-400" />} title="Voice Relay">
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            An iPhone Shortcut uploads a voice recording to a relay service, which sends it through WhisperX for
            transcription <em>with speaker diarization</em>, structures it with an LLM, writes it straight into the
            Obsidian vault, and posts the transcript back to Telegram for confirmation — all before I've finished
            walking wherever I was walking.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            It's monitored the same way as everything else here (Prometheus metrics on upload count, processing time,
            failure rate) — and it had its own real incident: the upload endpoint was unauthenticated <em>and</em> running
            as root. Both fixed the same day it was found: bearer-token auth added, service dropped to a non-root
            user. Same standard as everything else on this platform, applied to the one corner that had briefly slipped it.
          </p>
        </SectionCard>

        {/* What this demonstrates */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-cyan-400" />
            What This Demonstrates
          </h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Operating discipline</strong> — the eval loop scores real usage every
                night, not just at ship time, so quality regressions get caught in the ordinary course of running
                the thing, not discovered later.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Judgment over automation</strong> — the self-improvement loop
                proposes changes, it doesn't apply them. One real run proposed a fix that sounded right and was
                wrong for the context; catching that before it landed is the actual point of the human step.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Consistent trust boundaries</strong> — the same no-silent-actions
                rule applies everywhere in the platform, from outreach emails to prompt patches to a voice-relay
                endpoint that briefly slipped it and got fixed the day it was found.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <a
              href="https://github.com/NousResearch/hermes-agent"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline underline-offset-2"
            >
              <ChipIcon className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
              hermes-agent on GitHub (Nous Research)
            </a>
            <a
              href="/#contact"
              className="text-cyan-400 hover:text-cyan-300 text-xs font-mono underline underline-offset-2"
            >
              <ServerIcon className="h-3.5 w-3.5 inline mr-1 -mt-0.5" />
              Ask me about my deployment
            </a>
          </div>
          <Button variant="primary" onClick={onClose}>Close Details</Button>
        </div>
      </div>
    </Modal>
  );
};
