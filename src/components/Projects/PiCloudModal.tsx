import React from "react";
import {
  ServerIcon, CloudIcon, ChartBarIcon, ShieldCheckIcon, LightBulbIcon, KeyIcon
} from "@heroicons/react/solid";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";

interface PiCloudModalProps { isOpen: boolean; onClose: () => void; }

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
  const directoryStructure = `~/pi-cloud/
├── crowdsec/        # IPS / Real-time Banning
├── homepage/        # Unified Service Dashboard
├── immich/          # Local Photo Engine (NVMe Backed)
├── monitoring/      # Prometheus & Grafana
├── paperless-ngx/   # Self-Hosted Document Management
├── pihole/          # DNS-level Ad-Blocking
├── tailscale/       # WireGuard Mesh & TLS
├── uptime-kuma/     # Health & Heartbeat Checks
├── vaultwarden/     # Managed Identity & 2FA
└── watchtower/      # CD (Automated Updates)`;

  const backupScriptSnippet = `#!/bin/bash
# --- Config & Mount Points ---
SOURCE="/home/drewpi/pi/"
SD_DEST="/mnt/sd_backup/pi-mirror/"
USB_DEST="/mnt/usb_backup/pi-mirror/"
TOPIC="drew-pi-alerts-XXXX"
KUMA_URL="http://drewpi:3001/api/push/TOKEN?status=up"

# 1. Atomic Snapshots (Ensuring DB Integrity)
sqlite3 $SOURCE/uptime-kuma/data/kuma.db "VACUUM;"
sqlite3 $SOURCE/uptime-kuma/data/kuma.db ".backup '$SOURCE/uptime-kuma/data/kuma.db.bak'"

sqlite3 $SOURCE/vaultwarden/vw-data/db.sqlite3 "VACUUM;"
sqlite3 $SOURCE/vaultwarden/vw-data/db.sqlite3 ".backup '$SOURCE/vaultwarden/vw-data/db.sqlite3.bak'"

# 2. Dual-Pass Sync (Primary Mirror + Emergency Lifeboat)
EXCLUDES=(--exclude='*.log' --exclude='cache/' --exclude='*.db')
rsync -av --delete "\${EXCLUDES[@]}" "$SOURCE" "$SD_DEST"

# 3. Secure Push Notifications & Monitoring Heartbeat
if [ "$SD_USAGE" -gt 90 ]; then
    curl -H "Priority: urgent" -d "Backup Full" "https://ntfy.sh/$TOPIC"
fi
curl -s "$KUMA_URL"`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" ariaLabel="Pi-Cloud Infrastructure Details">
      {/* Hero Header */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img src="/images/projects/pi-cloud.webp" alt="Pi-Cloud Edge Gateway" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Infrastructure</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">100% Operational</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pi-Cloud: The Invisible Edge Gateway</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">Production-Grade Sovereignty & Zero-Trust Networking</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        
{/* 1. Architecture: The Engine */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Engineered on a <strong className="text-white">Raspberry Pi 5 (8GB)</strong> backed by a high-end <strong className="text-white">500GB NVMe M.2 SSD</strong>. This hardware stack functions as a <strong>High-Performance Edge Gateway</strong>, delivering sub-1ms local latency for 10 containerized services—effectively eliminating the 'Cloud Lag' associated with traditional SaaS providers.
          </p>
        </SectionCard>

        {/* 2. UX: The Single Pane of Glass */}
        <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-cyan-400" />} title="The 'Single Pane of Glass'">
          <p className="text-slate-300 text-sm leading-relaxed">
            Infrastructure complexity is abstracted into a unified <strong>Homepage</strong> dashboard. This 'Single Pane of Glass' orchestrates real-time telemetry (CPU, Thermals, RAM) and service health, providing a <strong>frictionless command center</strong> for monitoring global traffic and automated maintenance logs.
          </p>
        </SectionCard>

        {/* 3. Logic: Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<KeyIcon className="h-5 w-5 text-cyan-400" />} title="Digital Sovereignty">
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span><strong className="text-white">Immich:</strong> A high-performance, self-hosted media engine replacing Google Photos with full privacy.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span><strong className="text-white">Vaultwarden:</strong> A sovereign instance of the Bitwarden API for encrypted 2FA and credential management.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span><strong className="text-white">Paperless-ngx:</strong> Self-hosted document management with OCR search, replacing cloud document scanners.</span>
              </li>
            </ul>
          </SectionCard>

          <SectionCard icon={<ShieldCheckIcon className="h-5 w-5 text-cyan-400" />} title="Zero-Trust & Global Security">
  <ul className="space-y-3 text-sm text-slate-400">
    <li className="flex items-start gap-2">
      <span className="text-emerald-400 mt-0.5">✓</span>
      <span><strong className="text-white">Global Exit Node:</strong> Utilizing <strong>Tailscale</strong>, the Pi acts as a secure exit node for mobile devices. This routes all cellular/public traffic through the home gateway, applying Pi-hole ad-blocking and Unbound encryption anywhere in the world.</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-400 mt-0.5">✓</span>
      <span><strong className="text-white">Recursive DNS:</strong> <strong>Unbound</strong> resolves queries at the root level, ensuring DNS requests never touch 3rd-party upstream providers (like Google or Cloudflare).</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-400 mt-0.5">✓</span>
      <span><strong className="text-white">Intrusion Prevention:</strong> <strong>CrowdSec</strong> parses service logs in real-time to detect and ban malicious actors at the kernel level before they can pivot within the network.</span>
    </li>
  </ul>
</SectionCard>
        </div>

        {/* 4. DevOps: The Decoupled Model */}
        <SectionCard icon={<CloudIcon className="h-5 w-5 text-cyan-400" />} title="Decoupled Service Model">
          <p className="text-slate-300 text-sm leading-relaxed">
            Every service is isolated in its own directory with distinct configurations and <code>.env</code> files. This mirrors <strong>enterprise DevOps workflows</strong>, ensuring modular updates and zero cross-contamination between service volumes.
          </p>
          <CodeBlock code={directoryStructure} language="text" />
        </SectionCard>

        {/* 5. Safety: Disaster Recovery */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Atomic Disaster Recovery">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A custom Bash script executes a daily <strong>dual-pass sync</strong>. It utilizes SQLite <code>VACUUM</code> and <code>.backup</code> to ensure point-in-time database integrity before mirroring to bootable SD and ExFAT "Lifeboat" media.
          </p>
          <CodeBlock code={backupScriptSnippet} language="bash" />
        </SectionCard>

        {/* 6. Professional Connection */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6">
  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
    <LightBulbIcon className="h-5 w-5 text-cyan-400" /> The Practical Edge: Why Build This?
  </h3>
  <ul className="space-y-4 text-sm text-slate-400">
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Absolute Digital Autonomy</strong> — Replaces recurring cloud subscriptions (Google Photos, Bitwarden, VPNs) with a high-performance, private alternative that keeps personal data off third-party servers.
      </span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Travel-Ready Security</strong> — By utilizing the Pi as a <strong>Tailscale Exit Node</strong>, mobile devices gain the full protection of Pi-hole ad-blocking and Unbound DNS encryption even on insecure public Wi-Fi networks.
      </span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Invisible UX</strong> — Despite the underlying complexity of 10 microservices and kernel-level IPS, the "Single Pane of Glass" dashboard provides a frictionless, SaaS-like experience for daily use.
      </span>
    </li>
  </ul>
</div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-500 text-xs italic font-mono tracking-tight">System Status: 100% Operational • Encryption: AES-256-GCM</p>
          <Button variant="primary" onClick={onClose}>Close Technical Deep Dive</Button>
        </div>
      </div>
    </Modal>
  ); 
};