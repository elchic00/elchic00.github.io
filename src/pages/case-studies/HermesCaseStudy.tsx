import { CaseStudyLayout, Section, StatRow, Stat, Callout, Figure } from "./CaseStudyLayout";

const HermesCaseStudy = () => (
  <CaseStudyLayout
    title="Hermes"
    subtitle="hermes-agent, Nous Research's open-source harness, running self-hosted with a nightly eval loop and a weekly self-improvement cron built around it — nothing changes without my approval."
    tech={["hermes-agent", "Langfuse", "LiteLLM", "Telegram", "HITL", "Evals", "WhisperX", "Obsidian", "Cron", "LLM-as-Judge"]}
    repoLink={{ href: "https://github.com/NousResearch/hermes-agent", label: "hermes-agent on GitHub (Nous Research)" }}
  >
    <Section title="Why This Exists">
      <p>
        None of this started as a plan. A Mac Mini bought for a desktop, a Raspberry Pi to stop
        paying for SaaS, then an inference box to wire it all together — at some point three
        unrelated purchases became a homelab running my own AI agents. Voice memos turn into
        structured notes before I've put my phone away, and none of it needs me checking in on it
        manually.
      </p>
      <p>
        The agent runtime itself, <code>hermes-agent</code>, is Nous Research's open-source harness
        (MIT-licensed). I didn't write it — I deployed it, and I built the observability and safety
        layer around it. That distinction matters: running an agent unattended for weeks is a
        different problem than running one in a notebook while you watch. You need to know if it's
        actually doing a good job, not just whether it's still running.
      </p>
    </Section>

    <Section title="Architecture">
      <p>
        Three machines, three jobs. A <strong>Mac Mini (16GB)</strong> runs the orchestrator: the
        cron scheduler and the Telegram bot. It doesn't have the RAM to host a capable model
        itself, so every reasoning call routes over the LAN through <strong>LiteLLM</strong> to
        the <strong>Framework Desktop</strong>, whose unified-memory GPU serves local models
        (qwen-27b and qwen-35b-a3b) over a hand-patched llama.cpp build. A{" "}
        <strong>Raspberry Pi</strong> handles monitoring. Cloud providers (Nous Portal, OpenRouter,
        OpenAI) are wired in as a deliberate fallback — for anything sensitive, or when local hits
        its usage limit — not the default path.
      </p>
      <p>
        Memory is files-first: an Obsidian vault the agents read directly, with a quick-context
        profile loaded at every session start. I tried a vector-memory layer (mem0-oss +
        ChromaDB) first and pulled it — recall accuracy came in under the published community
        benchmarks and memories weren't accumulating the way they were supposed to. Markdown files
        turned out to be the more honest memory layer for this scale. Every call, local or cloud,
        is traced end-to-end in Langfuse — tool calls, LLM chains, timing, token counts.
      </p>
    </Section>

    <Section title="The Eval Loop and Self-Improvement">
      <p>
        This part is mine, not the harness's. A nightly cron pulls every conversation's execution
        trace from Langfuse and has an LLM judge score it on three criteria: <code>task_completed</code>{" "}
        (0/1), <code>tool_calls_efficient</code> (1–5), and <code>response_quality</code> (1–5).
        Scores post back to Langfuse, broken out by cron vs. interactive sessions, so a quality
        regression shows up as part of normal operation instead of getting discovered later.
      </p>
      <p>
        A second, weekly cron closes the loop: it pulls the last 30 days of low-scoring turns,
        clusters them by theme, and proposes specific edits to the agent's own system prompt —
        sent to Telegram, never applied automatically.
      </p>
      <p>
        One real run: <strong>11 low-quality turns</strong> clustered into{" "}
        <strong>3 patterns</strong>, producing <strong>3 proposed edits</strong>. Two were approved
        and landed in the prompt — <em>"lead with the answer"</em> and{" "}
        <em>"complete every action chain, no preamble-only turns."</em> The third was rejected: every
        turn in that cluster turned out to be an automated cron delivery, and the proposed fix
        didn't actually apply to that context. The loop found a real pattern and recommended the
        wrong fix for it. Catching that before it landed is the actual point of keeping a human in
        the loop — the system proposes, it doesn't decide.
      </p>
    </Section>

    <Callout title="What Broke: The Judge Was Overthinking It">
      <p>
        The nightly judge is a pure classification task — three small scores, no open-ended
        reasoning required. I first ran it through the judge model's default thinking mode, and it
        started timing out at around three minutes per trace. The model wasn't wrong, it was just
        reasoning its way through a decision that didn't need reasoning, burning tokens on a task
        that should have taken seconds.
      </p>
      <p>
        The fix was smaller than the symptom suggested: route the judge through the{" "}
        <code>ollama_chat/</code> path with <code>think:false</code> instead of the default
        endpoint, and the same scoring pass drops from minutes to seconds per trace. It's a good
        reminder that "smarter mode" isn't free, and that matching the model's reasoning budget to
        the actual shape of the task is part of the job, not a nice-to-have.
      </p>
    </Callout>

    <Figure
      src="/images/case-studies/hermes-langfuse-traces.png"
      alt="Langfuse tracing table showing spans for Hermes turns: LiteLLM requests, LLM calls, and tool calls with latencies and a cost column reading $0.00 on every row"
      caption="The trace table behind the eval loop: every turn decomposes into gateway, LLM, and tool spans — and the cost column reads $0.00 all the way down, because every call runs on local hardware."
    />

    <Section title="Honest Limitations">
      <ul>
        <li>
          The 27B model is bandwidth-bound — plain decode floors at 7.4 tokens/sec. Speculative
          decoding (MTP, detailed on the Inference Engine page) already recovers most of that gap
          to roughly 10 tokens/sec average, peaking near 19–24 t/s on structured output; a smaller
          quant would trade quality for more speed beyond that, and I haven't made that trade.
        </li>
        <li>
          Vector memory (mem0-oss + ChromaDB) didn't work well enough to keep — recall accuracy was
          too low, and I replaced it with the simpler files-first approach above.
        </li>
        <li>
          Two Obsidian <code>vault_patch</code> operations caused real data loss: replacing a
          heading wiped everything nested under it instead of just the next paragraph, and
          patching frontmatter on a file with empty frontmatter wiped the whole body. Both are
          fixed and documented now — patches default to append/prepend, and every patch gets
          verified against a before/after heading count instead of trusting a bare "OK" response.
        </li>
        <li>
          This is a solo homelab project, not a customer deployment: real scale, multi-tenant
          load, and adversarial inputs are things I'd want to pressure-test before claiming this
          generalizes past one operator's use.
        </li>
      </ul>
    </Section>

    <StatRow>
      <Stat value="3" label="Homelab Nodes" />
      <Stat value="$0" label="Marginal Cost / Call" />
      <Stat value="11" label="Low-Quality Turns Clustered" />
      <Stat value="2 of 3" label="Prompt Edits Applied" />
    </StatRow>
  </CaseStudyLayout>
);

export default HermesCaseStudy;
