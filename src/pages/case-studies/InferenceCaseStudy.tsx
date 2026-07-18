import { CaseStudyLayout, Section, StatRow, Stat, Callout, Figure } from "./CaseStudyLayout";

const InferenceCaseStudy = () => (
  <CaseStudyLayout
    title="Inference Engine"
    subtitle="A hand-patched llama.cpp build serving local models on GPU hardware the project doesn't officially support — tuned through a memory-allocator bug and speculative decoding, and debugged through a regression that traced back to my own code, not the dependency everyone assumed was at fault."
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
    <Section title="Why Run Inference Locally">
      <p>
        I run inference locally instead of calling a hosted API because it's the engine behind
        every local agentic workflow I run — reachable from my phone over Telegram, with every
        call traced and nightly graded by its own eval loop. Four models sit resident at once on
        a <strong>Framework Desktop (Ryzen AI Max+ 395, 128GB unified memory, Radeon gfx1151)</strong>{" "}
        — an APU llama.cpp doesn't officially support: two text models, a vision model for
        screenshot analysis, and a speech-to-text model doing transcription with speaker
        diarization.
      </p>
      <p>
        Getting there wasn't a config flag. It meant patching and building the serving engine
        from source (<code>GGML_HIP=ON</code>, <code>AMDGPU_TARGETS=gfx1151</code>) behind a
        LiteLLM router that also handles fallback for the clients that consume it — and then
        finding out the build was the easy part.
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
      <Stat value="47.8 t/s" label="35B gen, full GPU offload" />
      <Stat value="1,495 t/s" label="Prefill @2k context" />
      <Stat value="18.9 t/s" label="27B peak w/ MTP, 81% acceptance" />
      <Stat value="~5x" label="Prefill gain, rocWMMA disabled" />
    </StatRow>

    <Callout title="The Regression That Wasn't What It Looked Like">
      <p>
        Hours after a routine 132-commit upstream rebase, the 35B model started emitting fake
        tool-call JSON as plain text — wrong <code>finish_reason</code>, occasionally inventing
        tool names that don't exist. A controlled A/B test reproduced it cleanly: the current
        build hallucinated a tool call, the pre-rebase binary ran 28 tool calls clean. Template,
        flags, and schema were all checked and ruled out. At that point, "somewhere in those 132
        commits" was the only conclusion the evidence supported, so I pinned the model to the old
        binary and moved on.
      </p>
      <p>
        A week later, while assessing whether to pull more upstream commits, I read the actual
        GitHub issue tracker instead of re-guessing — and found maintainers describing this exact
        symptom as a known consequence of how the chat template behaves when a client fails to
        echo <code>reasoning_content</code> back on a tool-call replay turn. That reframed the
        whole investigation: the bug had never actually been bisected to a commit.
      </p>
      <p>
        The real root cause was in my own code. A whitelist function in my agent's{" "}
        <code>run_agent.py</code> decided which models get <code>reasoning_content</code> echoed
        back on replay — and this model family was never added to it. I fixed the whitelist, then
        verified it two ways: instrumenting the API call path to watch{" "}
        <code>reasoning_content</code> go from always-empty to growing turn-over-turn across a
        forced 7-turn tool-calling chain, and a 3-file sequential test that completed with zero
        hallucinated tool calls. The first diagnosis wasn't sloppy — it was the best-supported
        conclusion at the time. What mattered was treating the pin as a workaround instead of a
        close, and being willing to overturn a week-old conclusion when the evidence pointed at my
        own code instead of the dependency everyone had assumed was at fault.
      </p>
      <p>
        That fix turned out to be necessary but not sufficient. I switched the 35B model back onto
        the current build once the fix had one clean production run behind it. Less than 12 hours
        later, the first long, multi-step tool-calling chain on the new build reproduced the exact
        same hallucinated-tool-call symptom — <code>reasoning_content</code> was present and
        growing as expected, so the fix was doing its job, but something else on the current build
        still breaks under longer chains specifically. I reverted 35B back to the pinned old binary
        the same day. No further switch-back is planned until a second, still-unidentified factor
        is actually found — a longer soak alone isn't the bar anymore, a real root cause is.
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
      <Figure
        src="/images/case-studies/inference-grafana.png"
        alt="Grafana dashboard showing all three models up, with live tokens-per-second stats and generation-speed trend lines"
        caption="Live Grafana view: all three models resident and serving simultaneously. Steady-state generation here (28 t/s on the 35B) is the everyday number — the peak figures above are single-stream benchmark runs."
      />
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
