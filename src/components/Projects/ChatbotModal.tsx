import React from "react";
import {
  ChatIcon, SwitchHorizontalIcon, TerminalIcon, CursorClickIcon, LightningBoltIcon, SparklesIcon
} from "@heroicons/react/solid";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

interface ChatbotModalProps { isOpen: boolean; onClose: () => void; }

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-cyan-500/10 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="AI Chat Assistant project details">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/elchic00-chatbot.svg" alt="Diagram: browser sends a chat message to a Cloudflare Worker, which adds the complete compact project reference sheet before calling Gemini 2.5 Flash" className="w-full h-full object-cover bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Structured Context</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">$0 / Month</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">You've Probably Already Talked to This One</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">A small, auditable portfolio assistant—not a search system pretending to be one</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* Architecture Overview */}
        <SectionCard icon={<TerminalIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The chat widget on this page (bottom-right corner) POSTs to a <strong className="text-white">Cloudflare Worker</strong>,
            entirely serverless — no server to patch, scale, or pay for while idle. The Worker rate-limits by IP,
            adds a compact reference sheet for <strong className="text-white">every portfolio project</strong>, and calls <strong className="text-white">Gemini 2.5 Flash</strong> with
            that complete context. The API key never touches the frontend — it's a Cloudflare
            secret the browser can't see.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-amber-400 font-mono text-lg font-bold">5/min</div>
              <div className="text-slate-400 text-xs">Rate Limit / IP</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">1,500/day</div>
              <div className="text-slate-400 text-xs">Gemini Free Tier</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">100K/day</div>
              <div className="text-slate-400 text-xs">Cloudflare Free Tier</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-emerald-400 font-mono text-lg font-bold">$0</div>
              <div className="text-slate-400 text-xs">Marginal Cost / Call</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={<SwitchHorizontalIcon className="h-5 w-5 text-cyan-400" />} title="Why the Whole Project Corpus Fits">
          <p className="text-slate-300 text-sm leading-relaxed">
            There are five compact project records, so they fit comfortably beside the rest of the portfolio context.
            Supplying all of them is more reliable than guessing which three a visitor meant: follow-up questions retain
            their grounding, the behavior is easy to inspect, and there is no embedding service, ranking heuristic, or
            extra network hop to operate.
          </p>
        </SectionCard>

        <SectionCard icon={<SparklesIcon className="h-5 w-5 text-cyan-400" />} title="Structured Context, Not RAG">
          <p className="text-slate-300 text-sm leading-relaxed">
            Retrieval-augmented generation can use lexical matching and does not require a vector database. But calling
            this small, static setup “RAG” would obscure the useful decision: the source material already fits in the
            prompt. The Worker sends a structured reference sheet instead, and the model is instructed to stay within
            the listed facts.
          </p>
        </SectionCard>

        {/* Structured output -> UI */}
        <SectionCard icon={<CursorClickIcon className="h-5 w-5 text-cyan-400" />} title="From Free Text to Real UI">
          <p className="text-slate-300 text-sm leading-relaxed">
            Gemini's response can include action markers (<code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">[ACTIONS: view_resume]</code>) that
            the frontend parses into real buttons — open the resume, jump to a section, pre-fill the contact form.
            The model's free-text output drives actual UI state, not just a wall of text, with markdown rendered
            through <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">marked</code> and sanitized
            through <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300 text-xs">DOMPurify</code> before anything hits the DOM.
          </p>
        </SectionCard>

        {/* Why this matters */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <LightningBoltIcon className="h-5 w-5 text-cyan-400" />
            Why This Is the Story Worth Telling
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            This is the one project here you can verify in the same tab you're reading this in — no repo to trust,
            just a chat box to test. It also shows a concrete product decision: match the context strategy to the size
            and shape of the content, make the behavior auditable, and avoid infrastructure that the problem does not need.
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <a
            href="https://github.com/elchic00/elchic00.github.io/blob/main/worker/index.js"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm font-mono underline underline-offset-2"
          >
            <ChatIcon className="h-4 w-4 inline mr-1 -mt-0.5" />
            View worker/index.js — the request context
          </a>
          <Button variant="primary" onClick={onClose}>Close Details</Button>
        </div>
      </div>
    </Modal>
  );
};
