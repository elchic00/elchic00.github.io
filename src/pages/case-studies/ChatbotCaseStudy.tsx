import { CaseStudyLayout, Section, StatRow, Stat, Callout } from "./CaseStudyLayout";

const ChatbotCaseStudy = () => (
  <CaseStudyLayout
    title="AI Chat Assistant"
    subtitle="A serverless chat widget for this portfolio: Gemini 2.5 Flash behind a Cloudflare Worker, grounded in a small structured project corpus instead of a vector database."
    tech={[
      "Gemini 2.5 Flash",
      "Cloudflare Workers",
      "Structured Context",
      "DOMPurify",
      "Rate Limiting",
      "Serverless",
      "Wrangler",
    ]}
    repoLink={{ href: "https://github.com/elchic00/elchic00.github.io", label: "View Source" }}
  >
    <Section title="What It Is">
      <p>
        It's the chat button in the bottom-right corner of this page — try it while you're
        here, that's the whole demo. I built an assistant that answers questions about my
        experience, projects, skills, and travel, backed by Google's Gemini 2.5 Flash. No
        sign-up, no separate app: ask it what stack I used on a project or where I'm headed
        next, and it answers from context I wrote and maintain myself, not from a generic
        model guessing about a stranger.
      </p>
    </Section>

    <Section title="Architecture">
      <p>
        The browser doesn't talk to Google directly. It POSTs the message to a Cloudflare
        Worker, which checks CORS, rate-limits by IP, assembles the request context, and
        calls Gemini server-side. <code>GEMINI_API_KEY</code> lives as a Cloudflare secret —
        it never ships in the bundle the browser downloads and never shows up in a network
        tab, no matter how hard someone looks.
      </p>
      <p>
        The Worker is also where I drew the line on cost and abuse: 5 requests per minute
        per IP, comfortably inside Gemini's free tier and Cloudflare's, so the whole thing
        runs at zero marginal cost regardless of how much a visitor pokes at it. Generation
        is capped the same way — temperature 0.7, max 1,100 output tokens — enough room for
        a real answer without letting a reply run long. There's no server to patch, scale,
        or keep warm — it's serverless in the literal sense, no process exists between
        requests.
      </p>
    </Section>

    <Callout title="A Bug the Eval Caught, and a Fix That Held">
      <p>
        The context assembly above isn't just plumbing — it's also where a real accuracy
        bug lived. One eval question asked about primary backend language, and the
        assistant answered by faithfully summarizing <code>skills.ts</code>, which was
        itself wrong: it led with Kotlin, GraphQL, and Node, and dropped Python — the
        language actually behind most of the backend work I describe. The model wasn't
        hallucinating, it was accurately reporting bad source data. I rewrote the skills
        context to put Python first and cut Kotlin down to what it actually is, a narrower
        BFF-layer skill from one job (commit <code>5eb33f2</code>), and re-ran the question
        live today to confirm the fix held. That's the payoff of grounding this in files I
        maintain instead of a model's memory: when the assistant is wrong, the fix is a
        content edit, not a prompt-engineering guess.
      </p>
    </Callout>

    <StatRow>
      <Stat value="5/min" label="Rate Limit / IP" />
      <Stat value="1,500/day" label="Gemini Free Tier" />
      <Stat value="100K/day" label="Cloudflare Free Tier" />
      <Stat value="$0" label="Marginal Cost / Call" />
    </StatRow>

    <Section title="The Retrieval Decision (And Un-Decision)">
      <p>
        The interesting decision here isn't the model, it's the retrieval. When someone
        asks about a project, the Worker has to ground Gemini's answer in the right details
        instead of letting it improvise. The obvious modern answer is a vector database:
        embed the corpus, embed the query, cosine-similarity your way to the closest
        matches. I didn't build that.
      </p>
      <p>
        My first pass didn't skip retrieval either, though — it tokenized the query,
        stripped stop words, and scored each project record by keyword overlap against its
        title, technologies, description, and tags, then injected only the top matches.
        Plain string matching, no embedding model, no external API call. It worked. Then I
        deleted it.
      </p>
      <p>
        There are six project records. A vector index for six documents is solving a
        problem I don't have, and it turns out keyword scoring was solving one too:
        when the whole corpus fits in the prompt with room to spare, "top-scoring
        matches" and "just include everything" produce the same context. The scoring
        function wasn't wrong, it was answering a question — which records are relevant?
        — that a six-record corpus doesn't need asked. So the Worker now calls a single{" "}
        <code>formatProjectContext()</code> that hands Gemini every record unconditionally,
        labeled as the complete reference. Fewer moving parts, nothing to tune, no
        threshold that can quietly exclude the right document. The real lesson wasn't
        "build retrieval," it was noticing the retrieval I'd already built wasn't earning
        its keep and cutting it. That's the trade-off that gets more interesting if the
        project list ever grows past what fits comfortably in a prompt — this is a decision
        for the current corpus size, not a permanent one.
      </p>
    </Section>

    <Callout title="Why This Is the Story Worth Telling">
      <p>
        This is the one project on this site you can verify without trusting a repo — the
        chat box in the corner is the whole demo. It's also a concrete engineering
        decision, not a default: match the retrieval strategy to the actual size and shape
        of the content, and don't reach for infrastructure the problem doesn't need.
      </p>
    </Callout>

    <Section title="From Free Text to Real UI">
      <p>
        Gemini's response isn't just prose — it can end with an action marker like{" "}
        <code>[ACTIONS: view_resume]</code>, and the frontend parses that into a real
        button: open the resume PDF, jump to a section, pre-fill the contact form with the
        visitor's question, open my LinkedIn or GitHub. The model's free-text output drives
        actual UI state, not just a wall of text. Markdown renders through <code>marked</code>{" "}
        and gets sanitized through <code>DOMPurify</code> before anything touches the DOM —
        the assistant can format an answer, but it can't inject a script tag.
      </p>
    </Section>

    <Section title="Evaluation">
      <p>
        I ran a 20-question structured eval against the live endpoint (July 2026): 16
        factual and project questions with expected answers keyed to the actual corpus,
        plus 4 out-of-scope questions where the correct behavior is declining, graded
        strictly — an unsupported claim counts as wrong.
      </p>
      <p>
        The eval didn't even run cleanly on the first try. My test script hit
        Cloudflare's bot protection — error 1010, request blocked — because Python's
        default <code>urllib</code> User-Agent reads as a bot to Cloudflare, which is
        exactly the kind of thing Cloudflare is supposed to catch. The test tooling broke
        before the thing being tested did. Setting a real browser User-Agent and a
        matching <code>Origin</code> header fixed it in a couple of minutes, and the actual
        eval could start.
      </p>
      <StatRow>
        <Stat value="14/17" label="Fully Correct" />
        <Stat value="0" label="Fabrications" />
        <Stat value="2" label="Partial (Omissions)" />
        <Stat value="1" label="Real Bug Found" />
      </StatRow>
      <p>
        Of the questions that got an answer, 14 of 17 were fully correct and the two
        partials were omissions, not invented facts. But the most valuable output wasn't
        the accuracy number — it was a reliability bug: <strong>three of the four
        out-of-scope questions crashed the Worker with an HTTP 500</strong> instead of
        declining gracefully, reproducible on retry. Only one edge question got the
        graceful "I don't have access to that" it should have. That's exactly what evals
        are for: the happy path was fine, and the failure mode was hiding where nobody
        had looked.
      </p>
    </Section>

    <Section title="Limitations">
      <p>
        The assistant only knows what's in the project corpus and the context files I maintain
        by hand — it doesn't crawl the rest of the site or reason past what I've written for it,
        so it can be confidently wrong about anything outside that scope. Conversation memory lives in the browser tab, not a database — capped at
        the last 8 messages, with greeting messages filtered out of what gets sent as
        context — so it resets when you close the chat. And the "just include everything"
        approach I'm defending above has a shelf life: it's a bet on the corpus staying
        small enough to fit in a prompt. If the project list grows a lot, that's the point
        where retrieval — keyword scoring, or embeddings if the vocabulary gets fuzzy
        enough — earns its keep again. Not before.
      </p>
      <p>
        And an update on the crash the eval above found: retesting those same three
        questions live just now, all of them return a clean decline instead of a 500. I
        didn't fix that — nothing changed in the Worker's error handling. What changed is
        Gemini's own safety behavior upstream, which now declines those prompts cleanly on
        Google's side instead of returning something the Worker choked on. The underlying
        code hasn't gotten any safer: the Worker still has an unguarded{" "}
        <code>throw new Error("Failed to get response from AI")</code> in its catch path,
        untouched since the eval found the bug. It's not crashing today, but it's not
        hardened either — if the model's behavior shifts again, this can resurface exactly
        the way it did the first time.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default ChatbotCaseStudy;
