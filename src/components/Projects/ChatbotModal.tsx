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

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "js" }) => (
  <div className="relative group mt-4">
    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 text-xs text-slate-400 rounded border border-slate-700 font-mono">
      {language}
    </div>
    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 pt-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

export const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const scoringSnippet = `for (const word of queryWords) {
  if (title.includes(word))         score += 10;
  if (technologies.some(includes))  score += 5;
  if (keywords.some(includes))      score += 3;
  if (description.includes(word))   score += 2;
  if (fullText.includes(word))      score += 1;
}
// top 3 by score, injected into the Gemini prompt`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="AI Chat Assistant project details">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/elchic00-chatbot.svg" alt="Diagram: browser sends a chat message to a Cloudflare Worker, which keyword-scores it against the project corpus and forwards the top matches to Gemini 2.5 Flash, all for $0 per month" className="w-full h-full object-contain bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Live On This Site</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">$0 / Month</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">You've Probably Already Talked to This One</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">A production RAG chatbot that deliberately skipped the vector database</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* Architecture Overview */}
        <SectionCard icon={<TerminalIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The chat widget on this page (bottom-right corner) POSTs to a <strong className="text-white">Cloudflare Worker</strong>,
            entirely serverless — no server to patch, scale, or pay for while idle. The Worker rate-limits by IP,
            scores the message against a small project corpus, and calls <strong className="text-white">Gemini 2.5 Flash</strong> with
            the matched context injected into the prompt. The API key never touches the frontend — it's a Cloudflare
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

        {/* Why keyword RAG */}
        <SectionCard icon={<SwitchHorizontalIcon className="h-5 w-5 text-cyan-400" />} title="Why Keyword-RAG, Not Vector Search">
          <p className="text-slate-300 text-sm leading-relaxed">
            A vector database is the default reach for "search my content" — but this corpus is a handful of project
            summaries, not a document library. Vector search would mean standing up an embedding service, paying for
            it, and adding a network hop and a failure mode, all to solve a problem a weighted keyword match already
            solves deterministically, for free, inside the same Worker request. Reaching for the fancier tool isn't
            always the senior move — knowing when the simple one is actually correct is.
          </p>
        </SectionCard>

        {/* Real scoring code */}
        <SectionCard icon={<SparklesIcon className="h-5 w-5 text-cyan-400" />} title="The Scoring, For Real">
          <p className="text-slate-300 text-sm leading-relaxed">
            Stopword-filtered query terms are weighted by where they match — a title hit counts for more than a
            passing mention in the description — and the top 3 scoring projects get formatted into a "Relevant
            Projects" block appended to the system prompt before the call to Gemini.
          </p>
          <CodeBlock code={scoringSnippet} language="worker/index.js" />
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
            just a chat box to test. It's also the clearest example of a specific judgment call: reaching for the
            simplest architecture that actually solves the problem, priced it out to $0/month, and shipped it —
            rather than defaulting to whatever's most impressive-sounding on a resume.
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
            View worker/index.js — the real scoring code
          </a>
          <Button variant="primary" onClick={onClose}>Close Details</Button>
        </div>
      </div>
    </Modal>
  );
};
