import { CaseStudyLayout, Section, StatRow, Stat, Callout, Figure } from "./CaseStudyLayout";

const PiCloudCaseStudy = () => (
  <CaseStudyLayout
    title="Pi-Cloud"
    subtitle="Thirteen self-hosted services on a Raspberry Pi 5, run like real production infrastructure: clear service boundaries, no public ports, health checks everywhere, and disaster recovery tested, not just documented."
    tech={[
      "Docker",
      "Tailscale",
      "Pi-hole",
      "Unbound",
      "CrowdSec",
      "Prometheus",
      "Grafana",
      "WireGuard",
      "Raspberry Pi",
      "DevOps",
      "Zero Trust",
      "Immich",
      "Uptime Kuma",
      "SSD",
      "DNSSEC",
      "nftables",
      "rsync",
      "ChromaDB",
      "Crawl4AI",
    ]}
  >
    <Section title="Why self-host">
      <p>
        I run thirteen private services — photo storage, password management, document search,
        DNS filtering, private web search, remote access, monitoring, and the retrieval backend
        for an AI agent — on a Raspberry Pi 5 with a 500GB USB SSD.
        None of it is trying to recreate a hyperscaler. The point is owning the data path for the
        categories where that actually matters, understanding exactly how each piece fails, and
        keeping the whole thing maintainable at home scale instead of accumulating unmanageable
        sprawl.
      </p>
    </Section>

    <Section title="Architecture &amp; service boundaries">
      <p>
        Each service gets its own directory, its own configuration, and its own environment file,
        grouped by what it does: storage and productivity (<strong>Immich</strong> for photos,{" "}
        <strong>Vaultwarden</strong> for passwords and 2FA, <strong>Paperless-ngx</strong> for
        document management with OCR search), network ({" "}
        <strong>Pi-hole</strong> and <strong>Unbound</strong> for DNS, <strong>SearXNG</strong>{" "}
        for a private metasearch engine, <strong>Tailscale</strong> for remote access),
        observability and security (<strong>Prometheus/Grafana</strong>,{" "}
        <strong>Uptime Kuma</strong> for health and heartbeat checks, <strong>CrowdSec</strong>{" "}
        for intrusion detection, <strong>Watchtower</strong> for update monitoring and alerts, a{" "}
        <strong>Homepage</strong> dashboard for a single operational view), and — the two most
        recent additions — <strong>ChromaDB</strong> and <strong>Crawl4AI</strong>, described
        below.
      </p>
      <p>
        That separation is deliberate, not incidental. It keeps upgrades, restores, and incident
        investigation scoped to one service instead of turning the whole platform into a single
        blast radius — if Paperless-ngx breaks, I'm debugging Paperless-ngx, not untangling it from
        twelve other services sharing state.
      </p>
      <Figure
        src="/images/case-studies/pi-cloud-homepage.webp"
        alt="Homepage dashboard showing the self-hosted services grouped by category with live stats: Pi-hole queries blocked, Immich photo counts, CrowdSec alerts, and Uptime Kuma site status"
        caption="The single operational view: every service with its live stats — DNS queries filtered, photos hosted, intrusion alerts, and uptime — on one dashboard."
      />
    </Section>

    <Section title="Security model">
      <p>
        Nothing here is exposed with a public port. Remote access goes through{" "}
        <strong>Tailscale</strong>, which gives me reachability without opening any service
        directly to the internet — when useful, the Pi can also act as a private exit path for
        mobile devices. <strong>Unbound</strong> handles recursive DNS resolution directly, with{" "}
        <strong>Pi-hole</strong> filtering known ad and tracking domains across the home network in
        front of it. <strong>CrowdSec</strong> turns service logs into active detection and
        blocking signals for the access paths that are exposed — it typically holds 1,500 to 2,000
        active IP bans at any given time, mostly SSH bruteforce and port-scan attempts.
      </p>
      <p>
        One alert rule watches CrowdSec itself rather than just the services it protects: it fires
        if the active-ban cache drops near zero — the signature of a restart that silently lost its
        decision history and would reopen the door without anyone noticing.
      </p>
      <p>
        Automated access gets less trust than I do. The key my always-on agent uses can't open a
        shell at all — it's pinned to a restricted command set (a handful of read-only
        diagnostics, plus rsync backup receive into one specific directory), so a leaked
        automation key can't do anything beyond exactly what it's allowed to. Remote firewall
        changes go through a dead-man's switch: a scheduled <code>ufw disable</code> fires
        automatically a couple minutes after any change unless I cancel it, so a mid-change SSH
        lockout heals itself instead of requiring a trip to the physical hardware.
      </p>
    </Section>

    <Callout title="The LAN gap Tailscale never closed">
      <p>
        A routine audit turned "nothing is exposed" into a narrower claim than I'd been treating
        it as. Around fifteen Docker-published ports on the Pi were bound to <code>0.0.0.0</code>{" "}
        — reachable from anything on the home network, Tailscale-connected or not — because there
        was no host firewall behind them at all. Docker writes its own <code>iptables</code> rules
        ahead of the OS firewall's own chain when it publishes a port, so installing{" "}
        <code>ufw</code> after the fact does nothing for those ports on its own; it has to be
        wired into Docker's <code>DOCKER-USER</code> hook specifically, a step most setup guides
        skip entirely.
      </p>
      <p>
        Fixed with the same default-deny, LAN-plus-Tailscale policy already running on the other
        node, plus the Docker-specific chain patch — installed with an explicit subnet list rather
        than the tool's own default, since that default excludes Tailscale's own address range and
        would have quietly cut off remote access while reporting a clean install. The tailnet's
        device-to-device policy had the identical shape of gap one layer up: allow-all by default,
        meaning the one machine that processes untrusted content could reach every other device
        the moment it's compromised. That's now scoped down to exactly the ports other devices
        need from it, nothing back out.
      </p>
      <p>
        Verified with an actual off-network probe — wifi off, cellular only — rather than trusting
        a green firewall status, since that's the one claim a config file can't make for itself.
      </p>
    </Callout>

    <Section title="It's also backend infrastructure, not just my services">
      <p>
        Two of these aren't only mine — they're dependencies of an always-on agent.{" "}
        <strong>SearXNG</strong> is Hermes's default search backend, so every web lookup the
        agent makes resolves through the Pi instead of a search API. <strong>Crawl4AI</strong>{" "}
        does full-page extraction behind a bearer token: submit a URL, poll for the result.{" "}
        <strong>ChromaDB</strong> backed an early long-term-memory experiment (recall accuracy
        came in under published benchmarks, detailed on the Hermes page) — the experiment got
        pulled, and the container's still here, running and unused, until I either reclaim the
        resources or find it a real job.
      </p>
      <p>
        That raises the reliability bar in a specific way. A personal service that's down is an
        annoyance I discover when I go to use it. A service an unattended agent calls at 2am is a
        silent failure in somebody else's workflow — the agent gets an empty result and carries on
        as if it had searched. It's also the reason nothing in the agent's retrieval path calls a
        paid API for search, embeddings, or page extraction: that path terminates on hardware I
        own, on a LAN, at no marginal cost per call.
      </p>
    </Section>

    <StatRow>
      <Stat value="13" label="Self-hosted services" />
      <Stat value="0" label="Public ports exposed" />
      <Stat value="4" label="Grafana dashboards" />
      <Stat value="3" label="Independent recovery paths" />
    </StatRow>

    <Section title="Operations: monitoring, health checks, backups">
      <p>
        <strong>Uptime Kuma</strong> runs heartbeat checks against every service, so a failure
        shows up as a status change instead of a support ticket from myself three days later.{" "}
        <strong>Prometheus</strong> — which also scrapes the other two machines in the broader
        platform this Pi anchors — feeds four Grafana dashboards, with alert rules routed to the
        same channel I use for everything else running here, so infrastructure health and
        application activity land in one place instead of two dashboards nobody actually checks.
      </p>
      <p>
        Backups run nightly as a scripted dual-pass job. Before anything is copied, the SQLite
        databases behind Uptime Kuma, Vaultwarden, and CrowdSec get a <code>VACUUM</code> and an atomic{" "}
        <code>.backup</code> snapshot rather than a raw file copy — a raw copy can catch a database
        mid-write and be silently unusable on restore, which defeats the point of having a backup
        at all. The snapshot is then synced to two separate recovery destinations, excluding logs
        and cache so each run stays small and predictable. Every run reports its own success back
        into the monitoring stack, so a failed backup is visible the same day, not discovered
        during an actual recovery.
      </p>
      <Figure
        src="/images/case-studies/pi-cloud-containers.webp"
        alt="Grafana dashboard showing per-container CPU, memory, and network metrics for every self-hosted service, collected via cAdvisor and Prometheus"
        caption="Per-container resource metrics — cAdvisor feeds Prometheus, which feeds this Grafana dashboard, so a resource-hungry container shows up here before it takes down anything else on the Pi."
      />
    </Section>

    <Callout title="The backup alert that was wrong about the backup">
      <p>
        The nightly job started pushing "USB backup failed" alerts to my phone, and every time,
        the backup data was completely intact. rsync was exiting 23 — partial transfer — because{" "}
        <code>crowdsec/data/</code> contains symlinks to container-internal <code>/staging/</code>{" "}
        paths that don't resolve on the host. Everything that mattered copied fine; the run
        reported failure anyway. The script now treats exit codes 23 and 24 as success and alerts
        only on real failures.
      </p>
      <p>
        It's a two-line patch with a lesson I keep relearning here: monitoring is code, it has
        bugs, and a check you've never watched fail correctly isn't a check yet — it's a source of
        alerts you'll start ignoring. The same reasoning is why I confirm a restart with the
        Prometheus <code>up</code> query or Uptime Kuma rather than <code>docker ps</code>.{" "}
        ChromaDB in particular will sit there reporting "running" while every request into it
        times out.
      </p>
    </Callout>

    <Callout title="Two mismatched filesystems, on purpose">
      <p>
        The SD-card mirror and the USB recovery drive are deliberately kept on different
        filesystems rather than matched. A filesystem-level corruption is exactly the kind of
        failure that can silently affect every file on a volume at once — keeping the two recovery
        paths on different filesystems means that failure mode can't take out both copies at the
        same time.
      </p>
      <p>
        The USB drive stays exFAT on purpose, not just for the filesystem mismatch: macOS reads
        exFAT natively, so if the Pi itself dies, recovery means plugging that drive straight into
        the Mac Mini — no reformatting, no intermediate machine, no waiting.
      </p>
    </Callout>

    <Section title="Honest limitations">
      <p>
        This is manual, physical infrastructure. The docker-compose configs are mirrored daily into
        a private repo now, so the compose layer itself doesn't have to be retyped from memory — but
        that's a config backup, not infra-as-code: there's still no script that takes a bare Pi to a
        running stack. Reproducing this means restoring from the recovery media above and redoing
        the physical setup by hand.
      </p>
      <p>
        It's also explicitly not trying to be enterprise infrastructure: one Raspberry Pi running
        all thirteen services, no cluster, no failover node. That's a deliberate scope decision for a
        personal platform, not an oversight — but it does mean a hardware failure on the Pi itself
        takes every service down until the recovery media gets restored onto new hardware, which is
        exactly why the recovery path being tested, not just documented, mattered enough to build
        twice.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default PiCloudCaseStudy;
