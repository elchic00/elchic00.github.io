import { CaseStudyLayout, Section, StatRow, Stat, Callout, Figure } from "./CaseStudyLayout";

const InferenceCaseStudy = () => (
  <CaseStudyLayout
    title="Inference Engine"
    subtitle="Four models resident on one box, serving every agent I run at $0 marginal cost per call — a hand-patched llama.cpp build on GPU hardware the project doesn't officially support. Unmetered inference changes which workloads are worth building at all."
    tech={[
      "llama.cpp",
      "ROCm",
      "HIP",
      "GGML",
      "Speculative Decoding",
      "AMD Radeon",
      "Unified Memory",
      "LiteLLM",
      "Systemd",
      "Debugging",
      "MiniCPM-V",
      "WhisperX",
      "Langfuse",
    ]}
  >
    <Section title="What Unmetered Inference Buys">
      <p>
        Running locally isn't about a cheaper API bill — it's that $0 per call changes which ideas
        are worth trying. When every experiment is free, you stop pre-filtering them: leave an
        agent looping overnight on a hunch, re-run a prompt fifty times for variance, throw a
        100k-token context at a question to see if it helps, rewrite a system prompt at 2am and
        regrade a month of traces against it. On metered inference, most of those never happen —
        not because they're bad ideas, but because each one has to justify a line item.
      </p>
      <p>
        Whole workloads exist only because they're free. Every call is traced, and a nightly eval
        loop grades a sample and clusters the low-quality turns — a metering-hostile pattern that
        pays twice for every request worth keeping. Voice memos get transcribed with speaker
        diarization the moment they land; screenshots go to a vision model without me weighing
        whether this one's worth it. None of it is rented, so none of it can become someone else's
        outage, deprecation notice, or repricing — and nothing sensitive leaves the LAN.
      </p>
      <p>
        That runs on four models resident at once on a{" "}
        <strong>Framework Desktop (Ryzen AI Max+ 395, 128GB unified memory, Radeon gfx1151)</strong>{" "}
        — an APU llama.cpp doesn't officially support: two text models, a vision model, and a
        speech-to-text model, reachable from my phone over Telegram. Getting there wasn't a config
        flag. It meant patching and building the serving engine from source (
        <code>GGML_HIP=ON</code>, <code>AMDGPU_TARGETS=gfx1151</code>) behind a LiteLLM router that
        handles fallback for the clients that consume it — and then finding out the build was the
        easy part.
      </p>
    </Section>

    <Section title="The Hardware Problem: An Allocator Bug Disguised as a VRAM Limit">
      <p>
        For months the 35B MoE model was capped at 45 of 99 possible GPU layers. Pushing past
        that ceiling didn't just get slower — it fell off a cliff to roughly 0.01 tokens/sec,
        effectively hung. The obvious read is "not enough VRAM," but this chip has none: it's an
        APU, so the GPU reaches system RAM through the Graphics Translation Table, and ROCm's
        default memory-pinning behavior under <code>mmap</code> caused GTT page-fault thrashing
        once the resident working set crossed a threshold. More offloaded layers meant a bigger
        working set, which meant more contention for pinned regions, which meant thrashing
        instead of graceful degradation.
      </p>
      <p>
        The fix was <code>--direct-io</code>, which disables <code>mmap</code> for model loading
        entirely and sidesteps the region-pinning path — a stable full 99-layer offload, not just
        a faster one. Separately, <code>GGML_HIP_ROCWMMA_FATTN=OFF</code> — disabling an
        optimization (rocWMMA) that helps on most AMD GPUs but is a regression on this specific
        one — nearly quintupled prompt-processing speed. Neither fix came from a changelog; both
        came from reading GGML kernel code and benchmarking on the actual chip instead of trusting
        a flag's name.
      </p>
    </Section>

    <Section title="Speculative Decoding: Beating a Bandwidth Wall Instead of Fighting It">
      <p>
        The 27B model is dense — every parameter active on every token — which makes it
        bandwidth-bound instead of compute-bound: at Q8 (~28GB), the unified-memory ceiling caps
        plain decoding at a hard floor. I confirmed it was a hardware limit and not a config
        problem by checking that llama.cpp without speculative decoding performs identically to
        Ollama on the same model. No amount of GPU-layer tuning moves that number — it's a
        different bottleneck than the 35B's.
      </p>
      <p>
        MTP (multi-token prediction) sidesteps the wall instead of fighting it: the model's own
        draft head proposes several candidate tokens, and the main model verifies all of them in{" "}
        <strong>one</strong> forward pass instead of paying a full weight-read per token. Getting
        it working turned out to be the same fix as getting tool-calling working — both needed
        the canonical chat template instead of the GGUF's bundled default.
      </p>
    </Section>

    <StatRow>
      <Stat value="44.4 t/s" label="35B gen, full GPU offload" />
      <Stat value="1,495 t/s" label="Prefill @2k context" />
      <Stat value="23.7 t/s" label="27B peak w/ MTP, 95% acceptance" />
      <Stat value="~5x" label="Prefill gain, rocWMMA disabled" />
    </StatRow>

    <Callout title="The Regression That Wasn't What It Looked Like">
      <p>
        Hours after a routine 132-commit upstream rebase, the 35B model started emitting fake
        tool-call JSON as plain text. A controlled A/B test reproduced it cleanly: the current
        build hallucinated a tool call, the pre-rebase binary ran 28 tool calls clean. Template,
        flags, and schema all checked out, so "somewhere in those 132 commits" was the only
        conclusion the evidence supported. I pinned the model to the old binary and moved on.
      </p>
      <p>
        A week later I read the upstream issue tracker instead of re-guessing, and found
        maintainers describing this exact symptom as a consequence of a client failing to echo{" "}
        <code>reasoning_content</code> on a tool-call replay turn. The real root cause was in my
        own code: a whitelist in my agent's <code>run_agent.py</code> that this model family had
        never been added to. The first diagnosis wasn't sloppy — it was the best-supported
        conclusion at the time. What mattered was treating the pin as a workaround instead of a
        close, and overturning a week-old conclusion once the evidence pointed at my own code
        rather than the dependency I'd assumed was at fault.
      </p>
    </Callout>

    <Section title="Observability">
      <p>
        Every call through this stack routes through a LiteLLM gateway that handles fallback and
        traces every request into Langfuse. Nightly, an eval loop grades a sample of those traces
        and clusters low-quality turns; a weekly review proposes prompt fixes that go through
        human approval before anything changes.
      </p>
      <p>
        The patched dependency gets the same discipline. A standing weekly check diffs the local
        source patches against new upstream commits before any rebase runs. On one real run it
        confirmed a 132-commit pull touched a patched file but not the patched lines, clearing the
        rebase as safe in advance rather than hoping it was fine. The same check found that half
        the original patch set was no longer doing anything — one had been superseded upstream,
        the other was never actually load-bearing.
      </p>
      <p>
        The eval loop had a subtler problem than latency: the judge alias was pointing at the
        same model the agent runs on. <code>qwen-35b-a3b</code> was grading{" "}
        <code>qwen-35b-a3b</code> — the maximal case of LLM-as-judge self-preference bias, and
        worse, a judge that shares the agent's blind spots will forgive exactly the turns you
        most need it to flag. I moved the alias to the 27B: different architecture, same box,
        still $0. That's a floor, not a solution — the Hermes page has what happened when I
        actually calibrated both judges against frontier labels, and the answer wasn't
        flattering.
      </p>
      <Figure
        src="/images/case-studies/inference-grafana.webp"
        alt="Grafana dashboard showing 7 days of live inference metrics: current tokens/sec for all three models, plus generation-speed, prompt-ingestion, and hourly-throughput trend lines"
        caption="Live Grafana view, 7-day window: all three models resident and serving simultaneously — steady-state generation here (~29 t/s on the 35B) is the everyday number, not the single-stream peak figures above."
      />
    </Section>

    <Callout title="The Alert That Fired Because Inference Was Working">
      <p>
        Grafana started firing critical <code>target down</code> alerts on both text models
        while both were serving traffic normally. The endpoint was the problem, not the service.
        Prometheus scrapes <code>/metrics</code>, and llama.cpp's <code>/metrics</code> handler
        needs the same task-queue lock the inference loop holds, so it blocks while the model
        generates. Measured under load: <code>/health</code> returned 200 in <strong>3ms</strong>{" "}
        while <code>/metrics</code> timed out at <strong>10s</strong>. The scrape job had no{" "}
        <code>scrape_timeout</code>, so Prometheus fell back to its 10-second default and marked
        the target down every time the box was busy. The alert was firing precisely because
        inference was working hard.
      </p>
      <p>
        Underneath the false positive there was a real fault. The 35B was genuinely wedged,
        separately: Hermes had aborted several turns and llama.cpp kept generating for cancelled
        tasks, the journal filling with <code>srv stop: cancel task</code> and load average
        sitting at 30 with nothing legitimately running. A restart took <code>/metrics</code>{" "}
        from a 12-second timeout to <strong>1.8ms</strong> and load from{" "}
        <strong>30.3 to 7.2</strong> — which is how I know it was stuck rather than merely busy.
      </p>
      <p>
        Widening the scrape to 60s with a 30s timeout stopped the noise, and it cost real
        sensitivity: the alert now tolerates busy periods, so it's slower to catch an actual
        outage. The correct fix is a blackbox HTTP probe against <code>/health</code> for
        availability, with <code>/metrics</code> kept for stats only. That isn't built. If these
        alerts recur while the services are healthy, that's the next step rather than widening
        the timeout again.
      </p>
    </Callout>

    <Section title="The Silent Failure Mode: GPU Layers Loading Onto CPU After Reboot">
      <p>
        Twice — once on 2026-07-27, again two days later — a reboot brought all three
        llama-server services back up reporting healthy while silently running fully on CPU.
        Nothing failed loudly: <code>/health</code> returned 200, the services started, and
        generation just happened to be catastrophically slow until I noticed and manually
        restarted them.
      </p>
      <p>
        The root cause was a boot-order race: <code>amdgpu</code>/KFD registers the GPU{" "}
        <em>after</em> the systemd units start under <code>After=network.target</code>. When
        llama.cpp starts before the GPU node exists, it silently discards{" "}
        <code>--n-gpu-layers 99</code> and falls back to CPU — no error, no warning, nothing
        for <code>/health</code> to surface, because the process itself is running fine.
      </p>
      <p>
        The fix is an <code>ExecStartPre</code> systemd drop-in that blocks each unit from
        starting until a KFD topology node reports a non-zero <code>gpu_id</code> — the boot
        sequence now waits for the GPU to actually exist before handing it work, instead of
        assuming it will be there in time.
      </p>
    </Section>

    <Section title="Honest Limitations">
      <p>
        This isn't fully closed out. The <code>reasoning_content</code> fix is real and
        necessary — it's why the bug no longer reproduces on short exchanges — but a same-day
        switch-back attempt proved it isn't sufficient on its own: the hallucinated-tool-call
        symptom came back on the current build within 12 hours, on a longer tool-calling chain.
        The 35B and vision models stay pinned to the pre-rebase binary indefinitely now, with no
        further switch-back planned until a second contributing factor is actually identified —
        a longer soak alone isn't the bar anymore. I never ran a full <code>git bisect</code>{" "}
        across the original 132-commit range; once the first root cause traced to my own code it
        looked moot, and now looks necessary-but-incomplete instead. And there's no public repo or
        sanitized patch set yet — this write-up is step one toward that.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default InferenceCaseStudy;
