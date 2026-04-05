import React from "react";
import { 
  ServerIcon, LockClosedIcon, GlobeAltIcon, 
  CloudIcon, ChartBarIcon, ShieldCheckIcon,
  LightBulbIcon
} from "@heroicons/react/solid";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

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
  # Photo Backup & AI Processing
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    environment:
      - NODE_ENV=production 
    volumes:
      - /mnt/nvme_data/immich:/usr/src/app/upload
    restart: unless-stopped

  # Observability Stack (Prometheus & Grafana)
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus/config:/etc/prometheus
      - prometheus-data:/prometheus # Persistent metrics storage
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    restart: unless-stopped

  # Maintenance & CI/CD
  watchtower:
    image: containrrr/watchtower:latest
    environment:
      - WATCHTOWER_CLEANUP=true # Auto-prune old image layers
      - DOCKER_API_VERSION=1.44 # Prevents breaks during Engine updates
      # Active Alerting: Sends push notifications on successful updates
      - WATCHTOWER_NOTIFICATIONS=shoutrrr
      - WATCHTOWER_NOTIFICATION_URL=ntfy://ntfy.sh/drew-pi-alerts
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock`;

const systemOrchestrationSnippet = `#!/bin/bash
# High-Performance Sync & Capacity-Aware Alerting

SOURCE="/home/drewpi/pi-cloud/"
DEST="/mnt/sd_backup/pi-cloud-mirror/"
TOPIC="drew-pi-alerts"

# 1. Atomic Sync (Exclude volatile logs/cache to keep backup lean)
rsync -av --delete \\
  --exclude='*.log' --exclude='cache/' --exclude='tmp/' \\
  "$SOURCE" "$DEST"

# 2. Storage Health Check
USAGE=$(df /mnt/sd_backup | tail -1 | awk '{print $5}' | sed 's/%//')

# 3. Intelligent Push Notification via ntfy.sh
if [ "$USAGE" -gt 90 ]; then
    curl -H "Priority: urgent" -H "Tags: warning" \\
         -d "CRITICAL: SD Card at $USAGE%. Cleanup required!" \\
         "https://ntfy.sh/$TOPIC"
else
    curl -d "Daily Pi Backup Success ($USAGE% used)" "https://ntfy.sh/$TOPIC"
fi`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="Pi-Cloud Details">
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
          <p className="text-slate-300 mt-2 text-sm sm:text-base">Recursive DNS, Media Backups, and Real-time Observability on Pi 5</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        
        {/* Architecture Overview */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            An <strong>Edge Gateway</strong> built on a <strong className="text-white">Raspberry Pi 5 (8GB)</strong>. By utilizing an <strong className="text-white">NVMe M.2 SSD via USB 3.0 (UASP)</strong>, the stack eliminates the SD-card I/O bottleneck, enabling the high-speed data ingestion required for <strong>Prometheus metrics</strong> and <strong>Immich ML</strong> processing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">8GB</div>
              <div className="text-slate-500 text-xs">LPDDR4X RAM</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">UASP</div>
              <div className="text-slate-500 text-xs text-nowrap">USB 3.0 (PCIe Ready)</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">2.4GHz</div>
              <div className="text-slate-500 text-xs">Quad-Core ARM</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">&lt;1ms</div>
              <div className="text-slate-500 text-xs">Internal Latency</div>
            </div>
          </div>
        </SectionCard>

        {/* DNS & Privacy Engineering */}
        <SectionCard icon={<GlobeAltIcon className="h-5 w-5 text-cyan-400" />} title="Privacy-First DNS (Recursive Shield)">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Standard DNS (Google/ISP) logs every site you visit. My <strong>Recursive Shield</strong> architecture uses <strong>Pi-hole</strong> to sinkhole ads and <strong>Unbound</strong> to talk directly to the 13 global Root Nameservers.
          </p>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs mb-3">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <span className="text-white">Client</span> → <span className="text-rose-400 font-bold">Pi-hole Sinkhole</span> <span className="text-slate-600">(Blocks 150k+ Ad Domains)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 mb-2 pl-8">
              → <span className="text-amber-400 font-bold">Unbound Recursive Resolver</span> <span className="text-slate-600">(Bare-metal)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 pl-16">
              → <span className="text-emerald-400 font-bold">Global Root Servers</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs">
            <strong className="text-cyan-300">Why Unbound on Bare Metal?</strong> Running DNS outside of Docker eliminates the network bridge overhead, ensuring recursive resolution remains responsive even under heavy container load.
          </p>
        </SectionCard>

        {/* Security & Observability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<LockClosedIcon className="h-5 w-5 text-cyan-400" />} title="Zero-Trust Network">
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>Tailscale WireGuard tunnel for secure 5G/Public WiFi browsing.</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>CrowdSec IPS: Real-time packet dropping at the kernel level via <strong>nftables</strong>.</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span>SSH Hardening: ED25519 keys only; password auth disabled.</span></li>
            </ul>
          </SectionCard>

          <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-cyan-400" />} title="Real-time Observability">
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Full-stack monitoring via <strong>Prometheus & Grafana</strong> to track I/O throughput and thermal performance.
            </p>
            <div className="flex items-center gap-3">
               <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">Uptime Kuma Alerting</span>
               <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">Grafana Dashboards</span>
            </div>
          </SectionCard>
        </div>

        {/* Docker & Maintenance */}
        <SectionCard icon={<CloudIcon className="h-5 w-5 text-cyan-400" />} title="Modular Infrastructure (Docker)">
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            Services are containerized for isolation. Note the <strong className="text-white">API version lock</strong>—this prevents breaking changes when the Docker Engine auto-updates.
          </p>
          <CodeBlock code={dockerComposeSnippet} />
        </SectionCard>

        {/* Recovery Strategy */}
        <SectionCard icon={<ShieldCheckIcon className="h-5 w-5 text-cyan-400" />} title="Automated Disaster Recovery">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Stateful data protection for the Immich library. A custom <strong>rsync</strong> logic creates a bootable clone of the primary NVMe drive onto a high-endurance SD card every 24 hours.
          </p>
          <CodeBlock code={systemOrchestrationSnippet} language="bash" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-emerald-400 font-mono text-lg font-bold">Near-Zero</div>
              <div className="text-slate-500 text-xs text-nowrap">Recovery Time (RTO)</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-emerald-400 font-mono text-lg font-bold">90%</div>
              <div className="text-slate-500 text-xs">Alert Threshold</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-emerald-400 font-mono text-lg font-bold">Bootable</div>
              <div className="text-slate-500 text-xs">Ready Clone</div>
            </div>
          </div>
        </SectionCard>

        {/* Engineering Connection */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-cyan-400" /> Frontend Engineering Connection
          </h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Performance Budgets</strong> — Managing hardware constraints on a Pi (8GB) mirrors the discipline required for mobile-first React performance and bundle size management.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Real-time Telemetry</strong> — Designing Grafana dashboards for infrastructure informs how I implement frontend error tracking and user-experience monitoring (RUM).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Hardware Acceleration</strong> — Optimizing Immich with OpenCL translates to leveraging WebGPU and Web Workers for computationally heavy browser tasks.</span>
            </li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-xs italic font-mono tracking-tight">System Status: 100% Operational • Encryption: AES-256-GCM</p>
          <Button variant="primary" onClick={onClose}>Close Technical Deep Dive</Button>
        </div>
      </div>
    </Modal>
  );
};