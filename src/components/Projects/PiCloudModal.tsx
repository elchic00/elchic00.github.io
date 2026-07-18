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
        <img src="/images/projects/pi-cloud.svg" alt="Diagram of Pi-Cloud private services, access controls, monitoring, and recovery paths" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/30">Private Infrastructure</span>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full border border-emerald-500/30">Operated, Monitored, Recoverable</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Pi-Cloud: Private Services, Operated Deliberately</h2>
          <p className="text-slate-300 mt-2 text-sm sm:text-base">A personal service platform with explicit access, monitoring, and recovery paths</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
{/* 1. Architecture: The Engine */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Architecture Overview">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A <strong className="text-white">Raspberry Pi 5 (8GB)</strong> with a <strong className="text-white">500GB NVMe M.2 SSD</strong> runs the private services I use for photos, passwords, documents, DNS filtering, remote access, and monitoring. The point is not to recreate a hyperscaler: it is to own the data path, understand the failure modes, and keep the system maintainable at home scale.
          </p>
        </SectionCard>

        {/* 2. UX: The Single Pane of Glass */}
        <SectionCard icon={<ChartBarIcon className="h-5 w-5 text-cyan-400" />} title="The Operational View">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A <strong>Homepage</strong> dashboard puts service health beside the signals that matter when the machine is under load: CPU, thermals, RAM, storage, and recent maintenance. It does not remove complexity; it makes the state visible enough to act on before a small problem becomes a broken service.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { src: "/images/projects/grafana-homelab-overview.png", alt: "Grafana dashboard showing homelab resource usage across nodes" },
              { src: "/images/projects/grafana-crowdsec-security.png", alt: "Grafana dashboard showing CrowdSec intrusion-prevention bans and activity" },
              { src: "/images/projects/grafana-inference-health.png", alt: "Grafana dashboard showing local LLM inference health and throughput" },
            ].map((img) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full rounded-lg border border-slate-800 object-cover aspect-video"
              />
            ))}
          </div>
        </SectionCard>

        {/* 3. Logic: Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard icon={<KeyIcon className="h-5 w-5 text-cyan-400" />} title="Digital Sovereignty">
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span><strong className="text-white">Immich:</strong> A self-hosted media library that keeps personal photos under my control.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span><strong className="text-white">Vaultwarden:</strong> A self-hosted password manager for credentials and two-factor authentication.</span>
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
                <span><strong className="text-white">Private Access:</strong> <strong>Tailscale</strong> provides remote access without opening services directly to the public internet. When useful, the Pi can also provide a private exit path for mobile devices.</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-400 mt-0.5">✓</span>
                <span><strong className="text-white">Recursive DNS:</strong> <strong>Unbound</strong> resolves DNS directly, while Pi-hole filters known ad and tracking domains across the home network.</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-emerald-400 mt-0.5">✓</span>
                <span><strong className="text-white">Intrusion Prevention:</strong> <strong>CrowdSec</strong> turns service logs into actionable detection and blocking signals for exposed access paths.</span>
    </li>
  </ul>
</SectionCard>
        </div>

        {/* 4. DevOps: The Decoupled Model */}
        <SectionCard icon={<CloudIcon className="h-5 w-5 text-cyan-400" />} title="Decoupled Service Model">
          <p className="text-slate-300 text-sm leading-relaxed">
            Each service keeps its own directory, configuration, and <code>.env</code> file. That separation makes upgrades, restores, and incident investigation smaller: one service can change without turning the rest of the platform into a mystery.
          </p>
          <CodeBlock code={directoryStructure} language="text" />
        </SectionCard>

        {/* 5. Safety: Disaster Recovery */}
        <SectionCard icon={<ServerIcon className="h-5 w-5 text-cyan-400" />} title="Atomic Disaster Recovery">
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            A custom Bash script executes a daily <strong>dual-pass sync</strong>. SQLite <code>VACUUM</code> and <code>.backup</code> create a consistent snapshot before the data is mirrored to separate recovery media. The valuable property is not the script itself; it is having a recovery path that is tested and understandable.
          </p>
          <CodeBlock code={backupScriptSnippet} language="bash" />
        </SectionCard>

        {/* 6. Professional Connection */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6">
  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
    <LightBulbIcon className="h-5 w-5 text-cyan-400" /> What This Demonstrates
  </h3>
  <ul className="space-y-4 text-sm text-slate-400">
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Ownership with tradeoffs</strong> — Self-hosting trades convenience for responsibility. The value is understanding that trade and choosing it for the services where privacy and control matter.
      </span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Security by design</strong> — Private overlay access, DNS controls, service isolation, and monitoring are layered together instead of being treated as a last-minute add-on.
      </span>
    </li>
    <li className="flex items-start gap-2">
      <span className="text-cyan-400 mt-1">•</span>
      <span>
        <strong className="text-white">Operational discipline</strong> — Clear boundaries, visible health signals, and recovery media make the platform a useful exercise in running software, not just installing it.
      </span>
    </li>
  </ul>
</div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <p className="text-slate-400 text-xs italic font-mono tracking-tight">Private network • monitored services • documented recovery path</p>
          <Button variant="primary" onClick={onClose}>Close Technical Deep Dive</Button>
        </div>
      </div>
    </Modal>
  ); 
};
