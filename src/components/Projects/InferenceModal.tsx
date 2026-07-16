import React from "react";
import {
  ServerIcon,
  LightningBoltIcon,
  CodeIcon,
  LightBulbIcon,
  ChipIcon,
  ClockIcon,
} from "@heroicons/react/solid";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

interface InferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-cyan-500/10 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const DiffBlock: React.FC = () => (
  <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto font-mono text-sm mt-4">
    <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400 tracking-wide whitespace-nowrap">
      run_agent.py — reasoning_content echo whitelist
    </div>
    <div className="p-4 space-y-1 whitespace-nowrap">
      <div className="text-slate-400">REASONING_ECHO_MODELS = {"{"}</div>
      <div className="bg-rose-500/10 text-rose-400 px-2 -mx-2 rounded">
        - &nbsp;&nbsp;"deepseek", "kimi", "mimo"
      </div>
      <div className="bg-emerald-500/10 text-emerald-400 px-2 -mx-2 rounded">
        + &nbsp;&nbsp;"deepseek", "kimi", "mimo", "qwen"
      </div>
      <div className="text-slate-400">{"}"}</div>
    </div>
  </div>
);

export const InferenceModal: React.FC<InferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      ariaLabel="Inference Engine project details"
    >
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="/images/projects/inference-engine.svg"
          alt="Bar chart: Qwen 35B-A3B generates at 35 tokens/sec vs Qwen 27B with speculative decoding at 12 tokens/sec, on the same GPU"
          className="w-full h-full object-cover bg-slate-950"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">
              Model Serving
            </span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded-full border border-amber-500/30">
              Patched From Source
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Inference Engine: Four Local Models, One Hand-Patched GPU
          </h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">
            Text, vision, and voice, hand-patched from source and served on
            an APU llama.cpp doesn't officially support
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Architecture Overview */}
        <SectionCard
          icon={<ChipIcon className="h-5 w-5 text-cyan-400" />}
          title="Architecture Overview"
        >
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Running models locally instead of calling a hosted API means every
            one of these calls is free and private, with nothing about how
            they behave outside my control. The hand-patching is what it took
            to make that fast enough to actually be worth it. Four models
            resident at once on a{" "}
            <strong className="text-white">
              Framework Desktop (Ryzen AI Max+ 395, 128GB unified memory, Radeon
              gfx1151)
            </strong>{" "}
            — an APU with no dedicated VRAM, unofficially supported by
            llama.cpp: two text models, a vision model (screenshot/computer-use
            analysis), and a speech-to-text model doing transcription with
            speaker diarization. All hand-patched from source (
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              GGML_HIP=ON
            </code>
            ,{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              AMDGPU_TARGETS=gfx1151
            </code>
            ) behind a LiteLLM router that also handles fallback and tracing for
            the clients that consume it (an agent platform and a job-matching
            tool).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">
                128GB
              </div>
              <div className="text-slate-400 text-xs">Unified Memory</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">
                gfx1151
              </div>
              <div className="text-slate-400 text-xs">Unofficial Target</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">4</div>
              <div className="text-slate-400 text-xs">
                Models Resident — Text, Vision, Speech
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">
                $0
              </div>
              <div className="text-slate-400 text-xs">Marginal Cost / Call</div>
            </div>
          </div>
        </SectionCard>

        {/* Two GPU-specific fixes, consolidated */}
        <SectionCard
          icon={<ServerIcon className="h-5 w-5 text-cyan-400" />}
          title="Two Fixes, Same Chip"
        >
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            Two separate bugs were capping this GPU's performance, both fixed
            with a build flag rather than new hardware. Full GPU offload used
            to fall off a cliff into a near-hang past a certain point — the
            cause was a memory-management quirk in how the driver shares
            system RAM with the GPU on this chip (there's no dedicated VRAM
            to work with). One flag (
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              --direct-io
            </code>
            ) fixed it — a stable full-GPU load, not just a faster one.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Separately, an optimization that helps on most AMD GPUs (
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              rocWMMA
            </code>
            ) turned out to be a regression on this specific one. Disabling it
            gave roughly a{" "}
            <strong className="text-white">
              5x jump in prompt-processing speed
            </strong>{" "}
            (278 → 1,495 tok/s at 2k context) on the exact same hardware. The
            common thread: benchmark on the actual chip, don't trust what
            "usually" works.
          </p>
        </SectionCard>

        {/* Speculative Decoding */}
        <SectionCard
          icon={<LightningBoltIcon className="h-5 w-5 text-cyan-400" />}
          title="Speculative Decoding"
        >
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The 27B model is dense — every parameter active on every token — so
            it's <strong className="text-white">bandwidth-bound</strong>: the
            unified-memory ceiling caps plain decoding at a hard floor, verified
            as a hardware limit, not a config problem. MTP (multi-token
            prediction) sidesteps the wall instead of fighting it — the model's
            own draft head proposes several candidate tokens, and the main model
            verifies all of them in <strong className="text-white">one</strong>{" "}
            forward pass instead of paying a full weight-read per token.
          </p>
          <div className="grid grid-cols-2 gap-3 text-center max-w-sm">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">
                ~35 t/s
              </div>
              <div className="text-slate-400 text-xs">
                35B MoE, 3B active/token
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-amber-400 font-mono text-lg font-bold">
                ~10&#8211;15 t/s
              </div>
              <div className="text-slate-400 text-xs">
                27B dense + MTP, 27B active/token
              </div>
            </div>
          </div>
        </SectionCard>

        {/* The debugging story */}
        <SectionCard
          icon={<CodeIcon className="h-5 w-5 text-cyan-400" />}
          title="The Tool-Calling Regression"
        >
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            Hours after a routine upstream rebase, the 35B model started
            emitting fake tool-call JSON as plain text. A controlled A/B test
            reproduced it cleanly against the rebase — template, flags, and
            schema all ruled out. The pragmatic fix: pin the old binary and move
            on.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            A week later, reading the actual upstream issue tracker turned up
            maintainers describing this exact symptom as a structural
            consequence of how the chat template behaves when a client fails to
            echo{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              reasoning_content
            </code>{" "}
            back on a tool-call replay turn. That reframed the whole
            investigation — the bug was never actually bisected to an upstream
            commit.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            The real root cause was in my own agent code: a whitelist deciding
            which models get{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">
              reasoning_content
            </code>{" "}
            echoed back on replay never had this model family added to it.
          </p>
          <DiffBlock />
          <p className="text-slate-400 text-xs italic mt-3">
            The vision model hit its own build-update regression later — same
            fix pattern applied: pin the one affected service to the last
            known-good binary rather than rolling back the whole fleet.
          </p>
        </SectionCard>

        {/* Patch health */}
        <SectionCard
          icon={<ClockIcon className="h-5 w-5 text-cyan-400" />}
          title="Patch Health"
        >
          <p className="text-slate-300 text-sm leading-relaxed">
            A hand-patched dependency is a maintenance liability if nobody's
            watching it. A weekly check diffs the local patches against new
            upstream commits before any rebase runs. On one real update, it
            confirmed a 132-commit upstream pull touched a patched file but
            not the actual patched lines, clearing the rebase as safe in
            advance rather than hoping it was fine. The same check separately
            found that 2 of 4 tracked patches weren't doing anything anymore —
            one had been superseded by an upstream fix, the other was never
            actually load-bearing. A patch set that only grows is a patch set
            nobody's actually verifying.
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
                <strong className="text-white">Benchmark discipline</strong> —
                flags and config changes get measured on the actual target
                chip before being trusted, because a flag's name doesn't tell
                you what it does on hardware the project doesn't officially
                support.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Treating a fix as a workaround, not a close</strong> —
                pinning the old binary solved the symptom immediately; the
                investigation stayed open until the real cause turned up a
                week later.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Willingness to blame your own code</strong> —
                the well-evidenced first diagnosis pointed at the upstream
                dependency; the regression was eventually traced to a bug in
                my own agent code instead.
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-400 text-xs italic font-mono tracking-tight">
            No public repo yet &#8212; this write-up is step one.
          </p>
          <Button variant="primary" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};
