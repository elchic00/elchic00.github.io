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
        runs at zero marginal cost regardless of how much a visitor pokes at it. There's no
        server to patch, scale, or keep warm — it's serverless in the literal sense, no
        process exists between requests.
      </p>
    </Section>

    <StatRow>
      <Stat value="5/min" label="Rate Limit / IP" />
      <Stat value="1,500/day" label="Gemini Free Tier" />
      <Stat value="100K/day" label="Cloudflare Free Tier" />
      <Stat value="$0" label="Marginal Cost / Call" />
    </StatRow>

    <Section title="The Retrieval Decision">
      <p>
        The interesting decision here isn't the model, it's the retrieval. When someone
        asks about a project, the Worker has to ground Gemini's answer in the right details
        instead of letting it improvise. The obvious modern answer is a vector database:
        embed the corpus, embed the query, cosine-similarity your way to the closest
        matches. I didn't build that.
      </p>
      <p>
        Instead the Worker tokenizes the query, strips stop words, and scores each record
        in the project corpus by keyword overlap against its title, technologies,
        description, and tags — plain string matching, no embedding model, no external API
        call, no extra network hop. It's the same idea behind RAG, retrieve relevant
        context and inject it into the prompt, implemented with the cheapest tool that
        actually solves the problem.
      </p>
      <p>
        That's partly a scale argument. There are six project records. A vector index for
        six documents is solving a problem I don't have. Keyword scoring over a corpus
        that small runs synchronously inside the Worker in microseconds, and because the
        corpus is so small, the scored results and "just include everything" end up looking
        almost identical in practice — which is itself the finding. Embeddings earn their
        keep once a corpus is large or fuzzy enough that lexical matching starts missing the
        point; at this size, the boring approach is strictly better. It's free, it's
        deterministic — the same query scores the same way every time — and I can read the
        entire scoring function in thirty seconds instead of debugging why a similarity
        threshold quietly excluded the right document.
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
        had looked. The fix is on the list below.
      </p>
    </Section>

    <Section title="Limitations">
      <p>
        A few honest caveats. The assistant only knows what's in the project corpus and the
        context files I maintain by hand — it doesn't crawl the rest of the site or reason
        past what I've written for it, so it can be confidently wrong about anything outside
        that scope. Conversation memory lives in the browser tab, not a database, so it
        resets when you close the chat. And the keyword-scoring approach I'm defending above
        has a shelf life: if the project list grows a lot, or if visitors ask questions that
        don't share vocabulary with how I described a project, lexical matching will start
        missing things that semantic search wouldn't. That's the point where I'd actually
        reach for embeddings — not before.
      </p>
      <p>
        And one known bug, courtesy of the eval above: certain out-of-scope questions
        currently crash the Worker with a 500 instead of a graceful decline. Fixing that
        error path is the next change this project gets.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default ChatbotCaseStudy;
