import { CaseStudyLayout, Section, StatRow, Stat, Callout, Figure } from "./CaseStudyLayout";

const PiCloudCaseStudy = () => (
  <CaseStudyLayout
    title="Pi-Cloud"
    subtitle="Ten self-hosted services on a Raspberry Pi 5, run the way I'd want production infrastructure run: clear service boundaries, no public ports, health checks on everything, and backups I've actually restored from."
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
      "NVMe",
      "DNSSEC",
      "nftables",
      "rsync",
    ]}
  >
    <Section title="Why self-host">
      <p>
        I run ten private services — photo storage, password management, document search, DNS
        filtering, remote access, and monitoring — on a Raspberry Pi 5 with 500GB of NVMe storage.
        None of it is trying to recreate a hyperscaler. The point is owning the data path for the
        categories where that actually matters, understanding exactly how each piece fails, and
        keeping the whole thing maintainable at home scale instead of accumulating unmanageable
        sprawl.
      </p>
      <p>
        Self-hosting trades convenience for responsibility. The value is understanding that trade
        and choosing it deliberately for the services where privacy and control are worth the
        operational overhead — not applying it everywhere out of principle.
      </p>
    </Section>

    <Section title="Architecture &amp; service boundaries">
      <p>
        Each service gets its own directory, its own configuration, and its own environment file:{" "}
        <strong>Immich</strong> for photos, <strong>Vaultwarden</strong> for passwords and 2FA,{" "}
        <strong>Paperless-ngx</strong> for document management with OCR search,{" "}
        <strong>Pi-hole</strong> for DNS-level ad and tracking filtering, <strong>CrowdSec</strong>{" "}
        for intrusion detection, <strong>Uptime Kuma</strong> for health and heartbeat checks,{" "}
        <strong>Tailscale</strong> for remote access, a <strong>Prometheus/Grafana</strong>{" "}
        monitoring stack, a <strong>Homepage</strong> dashboard for a single operational view, and{" "}
        <strong>Watchtower</strong> for automated container updates.
      </p>
      <p>
        That separation is deliberate, not incidental. It keeps upgrades, restores, and incident
        investigation scoped to one service instead of turning the whole platform into a single
        blast radius — if Paperless-ngx breaks, I'm debugging Paperless-ngx, not untangling it from
        nine other services sharing state.
      </p>
      <Figure
        src="/images/case-studies/pi-cloud-homepage.png"
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
        blocking signals for the access paths that are exposed.
      </p>
      <p>
        The result is zero-trust by default: services aren't reachable unless you're already
        inside the private network.
      </p>
    </Section>

    <StatRow>
      <Stat value="10" label="Self-hosted services" />
      <Stat value="0" label="Public ports exposed" />
      <Stat value="4" label="Grafana dashboards" />
      <Stat value="2" label="Independent recovery paths" />
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
        databases behind Uptime Kuma and Vaultwarden get a <code>VACUUM</code> and an atomic{" "}
        <code>.backup</code> snapshot rather than a raw file copy — a raw copy can catch a database
        mid-write and be silently unusable on restore, which defeats the point of having a backup
        at all. The snapshot is then synced to two separate recovery destinations, excluding logs
        and cache so each run stays small and predictable. Every run reports its own success back
        into the monitoring stack, so a failed backup is visible the same day, not discovered
        during an actual recovery.
      </p>
    </Section>

    <Callout title="Two mismatched filesystems, on purpose">
      <p>
        The SD-card mirror and the USB recovery drive are deliberately kept on different
        filesystems rather than matched. A filesystem-level corruption is exactly the kind of
        failure that can silently affect every file on a volume at once — keeping the two recovery
        paths on different filesystems means that failure mode can't take out both copies at the
        same time.
      </p>
      <p>
        It's a small decision, but it's the difference between having a backup strategy and having
        one that's actually been thought through for how it could fail.
      </p>
    </Callout>

    <Section title="Honest limitations">
      <p>
        This is manual, physical infrastructure — there's no infra-as-code or public repo for the
        configuration yet, so reproducing it means redoing the setup by hand rather than running a
        script.
      </p>
      <p>
        It's also explicitly not trying to be enterprise infrastructure: one Raspberry Pi running
        all ten services, no cluster, no failover node. That's a deliberate scope decision for a
        personal platform, not an oversight — but it does mean a hardware failure on the Pi itself
        takes every service down until the recovery media gets restored onto new hardware, which is
        exactly why the recovery path being tested, not just documented, mattered enough to build
        twice.
      </p>
    </Section>
  </CaseStudyLayout>
);

export default PiCloudCaseStudy;
