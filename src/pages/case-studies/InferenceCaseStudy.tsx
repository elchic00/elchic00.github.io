import {
  CaseStudyLayout,
  Section,
  StatRow,
  Stat,
  Callout,
  Figure,
} from "./CaseStudyLayout";

const InferenceCaseStudy = () => (
  <CaseStudyLayout
    title="Inference Engine"
    subtitle="Three models resident on one box, serving every agent I run at $0 marginal cost per call — a hand-patched llama.cpp build on GPU hardware the project doesn't officially support. Standardizing on Qwen 3.8 27B delivers high-tier reasoning depth across parallel execution slots."
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
      "Qwen 3.8 27B",
      "Qwen3-VL",
      "WhisperX",
      "Langfuse",
    ]}
  >
    <Section title="What Unmetered Inference Buys">
      <p>
        Whole workloads exist only because they're free. Every call is traced,
        and a nightly eval loop grades a sample and clusters low-quality turns —
        a metering-hostile pattern that pays twice for every request worth
        keeping. Voice memos get transcribed with speaker diarization the moment
        they land; screenshots go to a vision model without me weighing whether
        this one is worth it. None of it is rented, so none of it can become
        someone else's outage, deprecation notice, or repricing — and nothing
        sensitive leaves the LAN.
      </p>
      <p>
        That runs across three resident models on a{" "}
        <strong>
          Framework Desktop (Ryzen AI Max+ 395, 128GB unified memory, Radeon
          gfx1151)
        </strong>{" "}
        — an APU architecture llama.cpp doesn't officially support.
        Standardizing solely on <strong>Qwen 3.8 27B</strong> as the primary
        text backbone provides strong reasoning capability and reliable
        tool-calling while keeping memory utilization optimized. This leaves
        enough VRAM for parallel text slots, a resident vision model (Qwen3-VL),
        and a speech-to-text pipeline (WhisperX). Getting there meant patching
        and building the serving engine from source (<code>GGML_HIP=ON</code>,{" "}
        <code>AMDGPU_TARGETS=gfx1151</code>) behind a LiteLLM router that
        handles failover to cloud fallbacks when required.
      </p>
    </Section>

    <Section title="The Hardware Problem: An Allocator Bug Disguised as a VRAM Limit">
      <p>
        Early testing on high-parameter models hit a ceiling where offloading
        additional GPU layers caused generation speed to plummet to ~0.01
        tokens/sec. While this looked like a VRAM limit, the actual issue was
        memory allocator contention on the APU architecture: the GPU accesses
        system RAM via the Graphics Translation Table (GTT), and ROCm's default
        memory-pinning under <code>mmap</code> caused GTT page-fault thrashing
        once the working set crossed a threshold.
      </p>
      <p>
        The fix was passing <code>--direct-io</code>, which disables{" "}
        <code>mmap</code> model loading entirely and allocates memory
        contiguously upfront. While this adds a few seconds to service startup,
        it eliminates non-deterministic page-fault jitter under heavy
        concurrency. Separately, setting <code>GGML_HIP_ROCWMMA_FATTN=OFF</code>{" "}
        — disabling an optimization (rocWMMA) that helps discrete AMD GPUs but
        regresses on gfx1151 APUs — nearly quintupled prompt prefill processing
        speed.
      </p>
    </Section>

    <Section title="Speculative Decoding: Beating a Bandwidth Wall">
      <p>
        Because Qwen 3.8 27B is a dense model where every parameter executes on
        every token, inference is strictly bandwidth-bound during generation. At
        Q8 quantization (~28GB working set), the host's ~200GB/s LPDDR5X memory
        bandwidth imposes a physical floor of ~7.4 t/s for plain autoregressive
        decoding.
      </p>
      <p>
        Multi-Token Prediction (MTP) and speculative decoding bypass this
        bandwidth ceiling by proposing draft candidate tokens verified by the
        main model in a single forward pass. On Qwen 3.8 27B, MTP lifts
        generation throughput off the 7.4 t/s memory-bound floor to a measured
        22.35 t/s peak on structured, tool-calling prompts (81% draft
        acceptance), holding a sustained ~10 t/s on everyday mixed traffic —
        real-time responsiveness for interactive agent loops without thermal
        throttling.
      </p>
    </Section>

    <StatRow>
      <Stat value="22.35 t/s" label="Qwen 3.8 27B gen w/ MTP (structured peak)" />
      <Stat value="1,495 t/s" label="Prefill @2k context" />
      <Stat value="7.4 t/s" label="Dense Q8 LPDDR5X baseline" />
      <Stat value="~5x" label="Prefill gain, rocWMMA disabled" />
    </StatRow>

    <Callout title="The Regression That Wasn't What It Looked Like">
      <p>
        Hours after a routine 132-commit upstream rebase, the text backend
        started emitting fake tool-call JSON as plain text. A controlled A/B
        test reproduced it cleanly: the fresh build hallucinated tool calls
        while the pre-rebase binary ran 28 tool calls cleanly. Because templates
        and schemas were unchanged, the rebase appeared to be the sole culprit,
        prompting a temporary commit pin.
      </p>
      <p>
        A week later, upstream discussions revealed that this specific
        hallucination occurs when a client fails to echo{" "}
        <code>reasoning_content</code> back during a multi-turn tool replay. The
        root cause was in my agent framework: an internal whitelist in{" "}
        <code>run_agent.py</code> had omitted the new model family. Treating the
        binary pin as a temporary workaround rather than a closed issue made it
        easy to overturn the initial assumption once the evidence pointed back
        to client-side code.
      </p>
    </Callout>

    <Callout title="What Broke: A Shared Cache Restored Someone Else's Conversation">
      <p>
        During the tool-calling investigation, another critical issue surfaced
        in llama.cpp's <code>server_prompt_cache</code>. By default, the server
        maintained an 8GB RAM-resident pool of full KV-state snapshots shared
        across slots. Under concurrent eviction, incoming requests could restore
        stale KV states from prior, unrelated conversations. In automated
        testing, 20 out of 20 concurrent requests suffered cross-conversation
        contamination — all while the API reported <code>cached_tokens: 0</code>
        .
      </p>
      <p>
        Traffic logs revealed this race condition triggered about once a day
        during high-concurrency bursts, causing persistent context pollution
        across unrelated requests. The fix (
        <code>--no-cache-idle-slots --cache-ram 0</code>) was submitted upstream
        (<code>ggml-org/llama.cpp#27148</code>) and deployed across all resident
        services, completely eliminating unprompted cache restoration.
      </p>
    </Callout>

    <Section title="Eval Loops & Autonomous Feedback">
      <p>
        Patched dependencies are audited alongside agent performance. A weekly
        automated check diffs local source patches against upstream changes
        before rebasing, ensuring patch compatibility in advance and stripping
        obsolete modifications.
      </p>
      <p>
        The evaluation pipeline previously suffered from self-preference bias
        when evaluating model outputs. Pointing evaluation tasks to a distinct
        model configuration broke the self-grading feedback loop, providing
        objective error detection for agent reasoning traces without introducing
        cloud API costs.
      </p>
      <Figure
        src="/images/case-studies/inference-grafana.webp"
        alt="Grafana dashboard showing 7-day inference metrics"
        caption="Live Grafana telemetry across a 7-day window. The panels monitor real-time token generation rates across parallel Qwen 3.8 27B slots alongside unified VRAM allocation, thermals, and request queue depths."
      />
    </Section>

    <Callout title="The Alert That Fired Because Inference Was Working">
      <p>
        Grafana began triggering critical <code>target down</code> alerts during
        heavy inference loads despite services functioning normally. Prometheus
        was configured to scrape <code>/metrics</code>, but llama.cpp's metric
        handler acquires the primary task-queue lock during generation. Under
        load, <code>/health</code> responded in 3ms while <code>/metrics</code>{" "}
        timed out after 10 seconds, causing Prometheus to mark the service down
        simply because it was processing queries.
      </p>
      <p>
        Widening the Prometheus scrape interval to 60 seconds with a 30-second
        timeout eliminated false alarms, though the long-term fix is decoupling
        availability monitoring via dedicated blackbox probes on{" "}
        <code>/health</code>.
      </p>
    </Callout>

    <Section title="The Silent Failure Mode: GPU Layers Loading Onto CPU After Reboot">
      <p>
        Reboots occasionally caused all model daemons to come back up reporting
        healthy while silently running strictly on CPU. The service returned
        HTTP 200 health checks, but generation speed dropped precipitously.
      </p>
      <p>
        The root cause was a boot-order race condition: the <code>amdgpu</code>
        /KFD kernel module registers the GPU node *after* systemd initializes
        services configured with <code>After=network.target</code>. Starting
        llama.cpp before the GPU device node was present caused it to silently
        ignore <code>--n-gpu-layers 99</code> and fall back to CPU execution.
      </p>
      <p>
        The fix was an <code>ExecStartPre</code> systemd drop-in script that
        blocks unit startup until the KFD topology node confirms a valid{" "}
        <code>gpu_id</code>, guaranteeing the hardware is initialized before
        starting inference daemons.
      </p>
    </Section>

    <Section title="Honest Limitations">
      <p>
        A 128GB unified memory architecture is flexible, but it defines a
        physical budget, and every model on the box draws from it. When I
        retired the 35B MoE model in August 2026 and made Qwen 3.8 27B the
        sole primary, the RAM it freed went to the 27B itself — a third
        parallel slot and 196k of context each, instead of a second, faster
        MoE sitting alongside it. That was a deliberate trade: one dense model
        with deep context and concurrency over two models that each had less
        headroom.
      </p>
      <p>
        The cost of that trade is the fallback chain. With no second local text
        model, a 27B outage no longer drops to another local backend — it
        falls straight to a cloud provider with a finite prepaid balance. That
        is an accepted regression for now, and the real open work: a second
        local fallback (or a hot-restart path) that restores a zero-cost
        safety net, plus the upstream items still open against this stack —
        the <code>server_prompt_cache</code> race (#27148) and the gfx1151
        allocator behavior that made <code>--direct-io</code> mandatory.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default InferenceCaseStudy;
