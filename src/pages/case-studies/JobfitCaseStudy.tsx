import { CaseStudyLayout, Section, StatRow, Stat, Callout } from "./CaseStudyLayout";

const JobfitCaseStudy = () => (
  <CaseStudyLayout
    title="Job-Fit Scorer"
    subtitle="A LangGraph pipeline that discovers, filters, and scores real job postings against my own portfolio — calibrated to tell me no, not to flatter me."
    tech={["LangGraph", "Python", "FastAPI", "Pydantic", "Langfuse", "SQLite", "pytest", "Codex CLI", "LLM-as-Judge", "Local Inference"]}
  >
    <Section title="The Problem">
      <p>
        Evaluating job postings honestly is harder than it sounds: read enough of them and every
        role starts to look like a plausible fit. I built a pipeline that does the first pass
        with discipline instead: pull postings straight from companies' ATS boards, throw out
        the ones that were never going to be relevant, and score the rest against an evidence
        document that describes what I've actually built — not a résumé's best-case phrasing of it.
      </p>
      <p>
        The hard part wasn't wiring an LLM up to a job posting. It was building something that
        wouldn't just tell me what I wanted to hear. The evidence document I score against has its
        own explicit "don't inflate" section, and the scorer is built to respect it — a posting
        heavy on customer-relationship work I have little evidence for should score low and say so,
        not get talked into a 70.
      </p>
    </Section>

    <Section title="Architecture">
      <p>
        Discovery polls each company's ATS board directly — Greenhouse, Ashby, and Lever —
        and writes new postings into a durable SQLite queue with a pending/scored/failed/closed
        lifecycle, keyed by content fingerprint so a re-posted listing doesn't re-trigger work.
        Before anything reaches an LLM, a plain deterministic classifier rejects postings that were
        never going to be relevant — generic solutions-architecture, management, ops, security,
        and foreign-only-remote roles — and collapses duplicate location variants onto one queue
        slot. Cost discipline as an architectural decision, not something bolted on after the bill
        arrives.
      </p>
      <p>
        What's left runs through a LangGraph state graph: <code>fetch_posting</code> →{" "}
        <code>extract_requirements</code> → <code>batch_score_requirements</code> →{" "}
        <code>staged_prose</code> → <code>compile_report</code>, with every stage typed against a
        Pydantic model — requirements, scores, talking points, final report. Scoring batches
        every extracted requirement into one call per posting keyed by stable requirement IDs,
        instead of the original design's one-LLM-call-per-requirement fan-out, and every stage
        gets its own span in a dedicated Langfuse project, tagged by ATS provider and company.{" "}
        <code>fetch_posting</code>{" "}
        and <code>compile_report</code> are plain, fully-unit-tested code with no LLM in the loop;
        everything that does touch an LLM is schema-validated, cached by posting-content hash, and
        retried narrowly instead of replayed wholesale on failure. A FastAPI endpoint and CLI sit
        on top, and results sync into a durable tracker as an append-only log.
      </p>
    </Section>

    <Section title="What Broke, and How I Found It">
      <Callout title="The board that looked healthy for months">
        <p>
          One ATS board silently migrated from one provider to another. The old integration kept
          getting back an HTTP 200 with an empty array — not a 404, not an error — so it looked
          exactly like a company with zero open roles instead of a broken integration. It quietly
          produced zero signal for months before I noticed the count never moved. I fixed it
          structurally rather than patching the one board: a <code>DeadBoardError</code> that
          fires on any zero-posting board, plus a live test that asserts every configured board is
          actually alive, not just reachable. (A related trap on the same class of API: one board
          returns a schema-documentation blob instead of real data if you don't send a{" "}
          <code>User-Agent</code> header — an easy way to misdiagnose a working integration as
          broken if you're hand-testing with a bare <code>curl</code>.)
        </p>
      </Callout>
      <Callout title="The 401 with a correct API key">
        <p>
          Auth and Langfuse tracing both started failing with 401s, and the API key was correct —
          I'd checked it three times. The cause was a gap between two libraries: <code>pydantic-settings</code>'s{" "}
          <code>env_file</code> loading populates its own <code>Settings</code> model but never
          touches <code>os.environ</code>, and the auth and tracing code read the raw environment
          directly instead of going through <code>Settings</code>. The key was right; the process
          just never saw it. Fixed by making the environment load explicit instead of assumed.
        </p>
      </Callout>
      <Callout title="Twenty-five minutes instead of two">
        <p>
          The first version of the parallel scoring stage used LangGraph's <code>Send</code> API to
          fan every requirement's scoring call out at once. That's correct LangGraph, but it queued
          every call simultaneously against a local inference server configured for two concurrent
          slots — turning what should have been a two-minute run into a twenty-five-minute one as
          requests piled up waiting for a slot. The fix wasn't more hardware, it was{" "}
          <code>RunnableConfig.max_concurrency</code>: cap the fan-out at what the server can
          actually serve in parallel, and let the queue do its job instead of fighting it.
        </p>
      </Callout>
      <Callout title="The bug that wasn't the permissions issue everyone assumed">
        <p>
          Both live crons crashed one morning with <code>attempt to write a readonly database</code>.
          The obvious suspect was the dual-account ownership hazard this homelab already has a
          playbook for — but that wasn't it. The real cause was structural: the database ran
          unconditional <code>DROP INDEX</code>/<code>CREATE INDEX</code> DDL on every single open,
          so any permission flip anywhere crashed every entrypoint, including ones that were
          logically read-only. Fixed by gating all schema work behind{" "}
          <code>PRAGMA user_version</code> — a healthy database now runs zero DDL on open, so a
          stray permission flip can't take down a read path again.
        </p>
      </Callout>
      <Callout title="The deduper that couldn't tell AWS from GCP">
        <p>
          A similarity-based deduplicator collapsing near-identical requirements onto one queue
          slot turned out to be too generous: requirements sharing around 84% string overlap got
          merged as duplicates even when they weren't — "AWS" and "GCP", "LangChain" and
          "LangGraph", "backend" and "frontend". It wasn't visible from reading the code; it only
          showed up once real extracted data ran through it. Fixed by refusing to merge whenever
          both sides still contain a content word the other side doesn't have, locked in with four
          regression tests.
        </p>
      </Callout>
    </Section>

    <Section title="Results & Scale">
      <StatRow>
        <Stat value="13" label="ATS boards polled" />
        <Stat value="315" label="passing tests (portable engine)" />
        <Stat value="76%" label="fewer LLM calls (V4)" />
        <Stat value="65%" label="faster end-to-end (V4)" />
      </StatRow>
      <p>
        The original scoring stage made one LLM call per extracted requirement — seven to eleven
        calls per posting, each re-sending the full evidence document. A rewrite (V4) replaced that
        with one batched call per posting, keyed by stable requirement IDs, with narrow per-ID
        retry instead of whole-batch replay. On three postings scored both ways, the batched
        version cut the run from 25 calls / 117.6K tokens / 53.2 minutes to 6 calls / 33.8K tokens
        / 18.5 minutes. A separate controlled test scored identical extracted requirements both
        ways and found the fit score moved by only 4 points — inside a self-imposed 5-point
        tolerance, with the one real disagreement being a single borderline judgment call rather
        than a systemic bias. The first live production run under the new code scored ten real
        postings end-to-end at two to three calls each and produced three sensible apply
        recommendations. I never ran the full formal three-way benchmark the original plan called
        for — that's a known, documented gap, not something I'm hiding.
      </p>
    </Section>

    <Section title="What It Actually Produces">
      <p>
        A real week (2026-W30): <strong>21 postings scored</strong>,{" "}
        <strong>2 flagged apply/referral-first</strong>, <strong>19 skipped</strong>. That's the
        report a weekly cron produces unattended — three decision buckets, not a dashboard number
        nobody acts on.
      </p>
      <p>
        The skip pile turned out to be the part I undervalued. The report tallies why things get
        skipped, so "Apache Spark and distributed computing" appearing as a blocker on 7 of 21
        postings, and a Databricks certification on 3, is a study list I didn't have to assemble.
        A scorer calibrated to tell me no produces something a flattering one can't: the same
        rejection, in the same words, often enough to be a plan.
      </p>
    </Section>

    <Section title="Observability, Without an LLM Judge">
      <p>
        The obvious next move here is to cron an LLM critic over the pipeline's own output. I
        considered it and decided against it: jobfit pushes traces to Langfuse, not scores, the
        offline golden benchmark was saturated at 100%, and a scheduled critic would have been
        burning a run every week to produce a signal I couldn't point to. What the weekly report
        actually needed was deterministic and had no LLM in it at all — a Health section
        reporting newly-scored counts per day against the pending backlog, warning on any day
        that scored zero while the backlog was nonzero, plus retry and batch-repair counts and
        the golden benchmark flagged whenever a metric drops under 100%.
      </p>
      <p>
        It paid for itself immediately. The 2026-07-20 line reads{" "}
        <em>"0 newly scored — cron may have failed"</em> — a silent cron failure surfaced the same
        week, rather than the way I found the dead ATS board, which was noticing months later
        that a number never moved. The saturated benchmark is a real limitation and gets its own
        fix: recorded outcomes now export into new golden cases, so real decisions grow the
        benchmark instead of a fixture I wrote myself.
      </p>
    </Section>

    <Section title="Honest Limitations">
      <ul>
        <li>
          <strong>Portable, not multi-tenant.</strong> The original build hard-coded one evidence
          document and one set of geography/company rules into module constants. A rewrite split
          that into a reusable engine with per-user config, evidence profile, and state directory
          behind a provider-neutral inference interface — including an experimental Codex CLI
          backend as an alternative to bringing your own API key, which needed a real fix (OpenAI's
          strict-JSON-schema contract requires <code>additionalProperties: false</code> on every
          nested object) before a Codex-backed score would complete end to end. That engine now
          ships in its own private repo with CI and a fresh-install test proving it runs with zero
          Hermes or Obsidian dependencies. True multi-tenant hosting — auth, isolation guarantees
          for a stranger's data — is a different, larger project I haven't started.
        </li>
        <li>
          <strong>Repo is private for now.</strong> The original research repo stays that way —
          its Git history carries real personal evidence content that can't simply be{" "}
          <code>.gitignore</code>d after the fact. The portable engine was re-seeded into a
          separate repo with a clean, sanitized history, so opening it up is a decision rather
          than a cleanup job. Code is available on request in the meantime.
        </li>
      </ul>
    </Section>
  </CaseStudyLayout>
);

export default JobfitCaseStudy;
