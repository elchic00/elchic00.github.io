import React from "react";
import { 
  ServerIcon, LockClosedIcon, GlobeAltIcon, 
  CloudIcon, ChartBarIcon, DatabaseIcon, ShieldCheckIcon 
} from "@heroicons/react/solid";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface PiCloudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-cyan-500/10 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "yaml" }) => (
  <div className="relative group mt-4">
    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-800 text-xs text-slate-400 rounded border border-slate-700 font-mono">
      {language}
    </div>
    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 pt-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

export const PiCloudModal: React.FC<PiCloudModalProps> = ({ isOpen, onClose }) => {
const dockerComposeSnippet = `services:
  # DNS Infrastructure
  unbound:
    image: mvance/unbound:latest
    network_mode: host
    volumes:
      - ./unbound:/opt/unbound/etc/unbound
    restart: unless-stopped

  pihole:
    image: pihole/pihole:latest
    environment:
      - TZ=America/New_York
      - WEBPASSWORD=admin
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "80:80/tcp"
    volumes:
      - ./pihole:/etc/pihole
    restart: unless-stopped

  # Photo Backup (Google Photos replacement)
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    environment:
      - TZ=America/New_York
      - IMMICH_MACHINE_LEARNING_URL=http://immich-ml:3003
      # OpenCL Hardware Acceleration for VideoCore VII GPU
      - NODE_ENV=production
    volumes:
      - immich-uploads:/usr/src/app/upload
    ports:
      - "2283:3001"
    restart: unless-stopped

  immich-ml:
    image: ghcr.io/immich-app/immich-machine-learning:release
    environment:
      # Enable OpenCL for Pi 5 GPU acceleration
      - MPLCONFIGDIR=/tmp/matplotlib
    volumes:
      - immich-cache:/cache
    restart: unless-stopped

  # Service Monitoring (UptimeRobot replacement)
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    ports:
      - "3001:3001"
    volumes:
      - kuma:/app/data
    restart: unless-stopped

  # CI/CD & Maintenance
  watchtower:
    image: containrrr/watchtower:latest
    environment:
      - WATCHTOWER_CLEANUP=true
      - DOCKER_API_VERSION=1.44
      - WATCHTOWER_POLL_INTERVAL=3600
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped

volumes:
  immich-uploads:
  immich-cache:
  kuma:`;

const systemOrchestrationSnippet = `#!/bin/bash
# System Orchestration & Disaster Recovery

NTFY_TOPIC="pi-alerts"
AUTH_LOG="/var/log/auth.log"

# Monitor for failed SSH attempts
tail -Fn0 "$AUTH_LOG" | while read line; do
  if echo "$line" | grep -q "Failed password"; then
    IP=$(echo "$line" | grep -oP 'from \\K[\\d.]+')
    curl -H "Title: SSH Failed Login" \\
      -d "Failed SSH attempt from $IP on $(hostname)" \\
      "ntfy.sh/$NTFY_TOPIC"
  fi
done &

# Disaster Recovery: Daily NVMe to SD Backup
# Creates bootable clone for near-zero RTO
rsync -avzHX --delete /mnt/nvme_data/ /mnt/sd_backup/ 2>&1 | tee /tmp/backup.log
if [ $? -eq 0 ]; then
  TRANSFERRED=$(grep "total size" /tmp/backup.log | awk '{print $4}')
  curl -d "✅ Pi-Cloud: Daily backup successful. Transferred: $TRANSFERRED" \\
    "ntfy.sh/$NTFY_TOPIC"
else
  curl -H "Priority: high" \\
    -d "⚠️ Pi-Cloud: BACKUP FAILED - Check storage immediately!" \\
    "ntfy.sh/$NTFY_TOPIC"
fi`;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      maxWidth="xl" 
      ariaLabel="Pi-Cloud Details"
    >
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/pi-cloud.webp" alt="Pi-Cloud" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Infrastructure</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">Production-Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pi-Cloud: High-Performance Edge Gateway</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">Production infrastructure with disaster recovery on Raspberry Pi 5 (8GB)</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        
        {/* Architecture Overview */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            The Pi-Cloud runs on a <strong className="text-white">Raspberry Pi 5 (8GB ARM64)</strong> with an <strong className="text-white">NVMe M.2 SSD via USB 3.0 (UASP)</strong>. This storage configuration provides the high-speed throughput required for Immich ML workloads and Prometheus time-series database operations. Core DNS infrastructure runs on bare metal for direct hardware access, while services are containerized for isolation.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">8GB</div>
              <div className="text-slate-500 text-xs">LPDDR4X RAM</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">USB 3.0</div>
              <div className="text-slate-500 text-xs">5Gbps + UASP</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">2.4GHz</div>
              <div className="text-slate-500 text-xs">Quad-Core</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">&lt;1ms</div>
              <div className="text-slate-500 text-xs">Local Latency</div>
            </div>
          </div>
        </SectionCard>

        {/* Networking & DNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<LockClosedIcon className="h-5 w-5 text-cyan-400" />} title="Zero-Trust Networking">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              All devices route traffic through the Pi via <strong className="text-white">Tailscale Exit Nodes</strong>, creating an encrypted tunnel for secure browsing on untrusted networks.
            </p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>WireGuard-based mesh VPN (point-to-point encryption)</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>ED25519 key-based SSH only (password auth disabled)</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>CrowdSec IPS with <strong className="text-white">nftables firewall bouncer</strong> — active packet dropping at kernel level</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Fail2ban for brute-force protection</span></li>
            </ul>
          </SectionCard>

          <SectionCard icon={<GlobeAltIcon className="h-5 w-5 text-cyan-400" />} title="DNS Flow">
            <p className="text-slate-300 text-sm leading-relaxed mb-4">The "Recursive Shield" eliminates third-party DNS logging by querying Root Nameservers directly.</p>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs mb-3">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <span className="text-white">Client</span> → <span className="text-rose-400">Pi-hole</span> <span className="text-slate-600">(Filter)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 mb-2 pl-8">
                → <span className="text-amber-400">Unbound</span> <span className="text-slate-600">(Recursive)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 pl-16">
                → <span className="text-emerald-400">Root Servers</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs"><strong className="text-cyan-300">DNSSEC validation + prefetching:</strong> Records proactively refreshed in cache, minimizing upstream latency.</p>
          </SectionCard>
        </div>

        {/* Private Cloud Services */}
        <SectionCard icon={<DatabaseIcon className="h-5 w-5 text-cyan-400" />} title="Private Cloud Services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                <h4 className="text-white font-medium text-sm">Immich</h4>
                <span className="text-xs text-slate-500 ml-auto">Photo/Video Backup</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Handles <strong className="text-white">100% of photo/video backups</strong>. Optimized with <strong className="text-cyan-300">OpenCL Hardware Acceleration</strong> on the Pi 5's VideoCore VII GPU for media transcoding.
              </p>
            </div>
            <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                <h4 className="text-white font-medium text-sm">Uptime Kuma</h4>
                <span className="text-xs text-slate-500 ml-auto">Monitoring</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitors the health of the <strong className="text-white">entire stack</strong>. Provides real-time status visibility with push notifications for downtime events.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Docker & Recovery Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<CloudIcon className="h-5 w-5 text-cyan-400" />} title="Docker Compose Stack">
            <p className="text-slate-400 text-xs mb-2">Note the <strong className="text-white">DOCKER_API_VERSION=1.44</strong> shim for Docker Engine v29+ compatibility.</p>
            <CodeBlock code={dockerComposeSnippet} />
          </SectionCard>
          <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-cyan-400" />} title="Recovery Logic">
            <p className="text-slate-400 text-xs mb-2">System orchestration script with integrated <strong className="text-white">ntfy.sh</strong> alerting.</p>
            <CodeBlock code={systemOrchestrationSnippet} language="bash" />
          </SectionCard>
        </div>

        {/* Disaster Recovery Detail */}
        <SectionCard icon={<ShieldCheckIcon className="h-5 w-5 text-cyan-400" />} title="Disaster Recovery & Backup Strategy">
          <div className="space-y-4">
            <p className="text-slate-300 text-sm leading-relaxed">
              Stateful data protection is critical for the Immich library. A <strong className="text-white">daily full-system rsync backup</strong> runs from the primary <strong className="text-white">USB-NVMe SSD</strong> to a secondary high-endurance MicroSD card, creating a bootable clone for emergency recovery.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-emerald-400 font-mono text-lg font-bold">Near-Zero</div>
                <div className="text-slate-500 text-xs">RTO (Recovery)</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-emerald-400 font-mono text-lg font-bold">24h</div>
                <div className="text-slate-500 text-xs">Interval</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-emerald-400 font-mono text-lg font-bold">Bootable</div>
                <div className="text-slate-500 text-xs">Clone Ready</div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Engineering Connection */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-cyan-400">→</span> Frontend Engineering Connection
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Managing this infrastructure deepened my understanding of <strong className="text-white">latency optimization</strong> (edge resolution &lt;1ms), <strong className="text-white">DevOps automation</strong> patterns, and <strong className="text-white">security-first architecture</strong>.
          </p>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Stateful Storage</strong> — Managing stateful backups informs my approach to frontend state management and offline-first capabilities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Hardware Acceleration</strong> — OpenCL GPU optimization translates to leveraging Web Workers and GPU acceleration (WebGPU) in browser-based apps.</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-xs italic">Private infrastructure — no external access</p>
          <Button variant="primary" onClick={onClose}>Close Details</Button>
        </div>
      </div>
    </Modal>
  );
};