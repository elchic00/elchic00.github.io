import React from "react";
import {
  ServerIcon, CloudIcon, ChartBarIcon, ShieldCheckIcon, LightBulbIcon, KeyIcon
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
  # --- Identity & Security ---
  vaultwarden:
    image: vaultwarden/server:latest
    volumes: [ './vaultwarden/vw-data:/data' ]
  pihole:
    image: pihole/pihole:latest
    volumes: [ './etc-pihole:/etc/pihole' ]
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    volumes: [ './crowdsec/config:/etc/crowdsec' ]

  # --- Observability & Dashboards ---
  homepage:
    image: ghcr.io/gethomepage/homepage:latest
    volumes: 
      - ./homepage/config:/app/config
      - /sys/class/thermal/thermal_zone0/temp:/sys/class/thermal/thermal_zone0/temp:ro
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    volumes: [ './uptime-kuma/data:/app/data' ]
  prometheus:
    image: prom/prometheus:latest
  grafana:
    image: grafana/grafana:latest
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
  node-exporter:
    image: prom/node-exporter:latest

  # --- Applications & Maintenance ---
  immich-server:
    image: ghcr.io/immich-app/immich-server:release
    volumes: [ '/mnt/nvme_data/immich:/usr/src/app/upload' ]
  watchtower:
    image: containrrr/watchtower:latest
    environment: [ 'WATCHTOWER_CLEANUP=true' ]`;

  const systemOrchestrationSnippet = `#!/bin/bash
# High-Performance Atomic Sync & Disaster Recovery
# Redacted for Public Portfolio Security

SOURCE="~/pi-cloud/"
SD_DEST="/mnt/sd_backup/pi-cloud-mirror/"
USB_DEST="/mnt/usb_backup/pi-cloud-mirror/"

# 1. Atomic Database State Preservation (SQLite VACUUM + Hot Backup)
# Ensures integrity for Vaultwarden, Kuma, CrowdSec, and Pi-hole stats
databases=("uptime-kuma/data/kuma.db" "vaultwarden/vw-data/db.sqlite3" "crowdsec/data/crowdsec.db" "etc-pihole/pihole-FTL.db")

for db in "\${databases[@]}"; do
    sqlite3 "$SOURCE/$db" "VACUUM;"
    sqlite3 "$SOURCE/$db" ".backup '$SOURCE/$db.bak'"
done

# 2. Sync Execution
EXCLUDES=(--exclude='*.log' --exclude='cache/' --exclude='*.db')

# Pass 1: Full System Mirror (SSD -> SD)
rsync -av --delete "\${EXCLUDES[@]}" "$SOURCE" "$SD_DEST"

# Pass 2: "Lifeboat" (SSD -> ExFAT USB)
# Critical data only; excludes large Immich assets for portability
rsync -av --delete --exclude='immich/' "\${EXCLUDES[@]}" "$SOURCE" "$USB_DEST"

# 3. Cleanup & Heartbeat
rm $SOURCE/**/*.db.bak
curl -d "Backup Complete" "https://ntfy.sh/<REDACTED_TOPIC>"
curl -s "http://<LOCAL_IP>:3001/api/push/<TOKEN>?status=up" # Uptime Kuma Heartbeat`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="Pi-Cloud Infrastructure Details">
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/pi-cloud.webp" alt="Pi-Cloud" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Infrastructure</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">Production-Ready</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pi-Cloud: High-Performance Edge Gateway</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">Identity Vaults, Zero-Trust Networking, and Full-Stack Observability on Pi 5</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A self-hosted <strong>Edge Gateway</strong> built on a <strong className="text-white">Raspberry Pi 5 (8GB)</strong>. Booting from an <strong className="text-white">NVMe M.2 SSD (500GB) via UASP</strong>, the stack eliminates standard I/O bottlenecks. This enables high-speed data ingestion for 11 integrated Docker services, including real-time telemetry and ML-driven photo processing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">8GB</div>
              <div className="text-slate-500 text-xs">LPDDR4X RAM</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">500GB</div>
              <div className="text-slate-500 text-xs">NVMe Storage</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">11</div>
              <div className="text-slate-500 text-xs">Microservices</div>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-cyan-400 font-mono text-lg font-bold">&lt;1ms</div>
              <div className="text-slate-500 text-xs">Local Latency</div>
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<KeyIcon className="h-5 w-5 text-cyan-400" />} title="Identity & 2FA Vault">
            <p className="text-slate-300 text-sm leading-relaxed">
              Full control over credentials using <strong>Vaultwarden</strong>. Manages and autofills TOTP (2FA) codes natively, eliminating reliance on proprietary cloud-based authenticator apps while keeping secrets encrypted at rest.
            </p>
          </SectionCard>

          <SectionCard icon={<ShieldCheckIcon className="h-5 w-5 text-cyan-400" />} title="Zero-Trust Network">
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span><strong>Tailscale:</strong> Secure WireGuard mesh routing.</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span><strong>CrowdSec:</strong> IPS for real-time kernel-level packet dropping.</span></li>
              <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span><span><strong>Pi-Hole:</strong> Network-wide ad & telemetry sinkhole.</span></li>
            </ul>
          </SectionCard>
        </div>

        <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-cyan-400" />} title="Full-Stack Observability & UI">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Infrastructure health is monitored via <strong>Prometheus & Grafana</strong>, utilizing <strong>cAdvisor</strong> and <strong>Node Exporter</strong> for telemetry. The entire lab is orchestrated through a central <strong>Homepage</strong> dashboard, with Pi hardware thermal sensors piped directly into the container UI.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">Uptime Kuma Alerts</span>
            <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">ntfy.sh Push Notifications</span>
            <span className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300">Watchtower CI/CD</span>
          </div>
        </SectionCard>

        <SectionCard icon={<CloudIcon className="h-5 w-5 text-cyan-400" />} title="Modular Deployment (Docker)">
          <CodeBlock code={dockerComposeSnippet} />
        </SectionCard>

        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Triple-Redundant Disaster Recovery">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A custom Bash script executes a dual-pass synchronization daily. Pass 1 creates a full bootable mirror on an SD card. Pass 2 syncs critical SQLite databases to an <strong>ExFAT USB Lifeboat</strong>—allowing immediate data decryption on macOS/Windows if the primary Linux hardware fails.
          </p>
          <CodeBlock code={systemOrchestrationSnippet} language="bash" />
        </SectionCard>

        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-5 w-5 text-cyan-400" /> Frontend Engineering Connection
          </h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">Performance Budgets</strong> — Managing hardware constraints on a Pi (8GB RAM, 16GB USB limit) mirrors the discipline required for mobile-first React performance and bundle size management.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span><strong className="text-white">State Operations</strong> — The backup script's SQLite VACUUM logic mirrors frontend patterns: optimistic UI updates, transaction rollback safety, and preventing sync conflicts during concurrent mutations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 mt-1">•</span>
              <span>
                <strong className="text-white">Full-Stack Observability</strong> — Mapping
                hardware thermals directly into the <strong>Homepage</strong> dashboard mirrors
                frontend telemetry patterns (e.g., Sentry, OpenTelemetry). It demonstrates a
                disciplined approach to monitoring system health and identifying bottlenecks before they impact the end-user.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-xs italic font-mono tracking-tight">System Status: 100% Operational • Encryption: AES-256-GCM</p>
          <Button variant="primary" onClick={onClose}>Close Technical Deep Dive</Button>
        </div>
      </div>
    </Modal>
  );
};