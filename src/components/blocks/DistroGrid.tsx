import type { DistroEntry } from '../../types/content';
import './extras.css';

/* Echte Marken-Logos als eigene SVG-Dateien unter /public/logos/.
   Ein Schlüssel je Distro -> Dateiname. */
const LOGO_FILES: Record<string, string> = {
  ubuntu: 'ubuntu',
  debian: 'debian',
  fedora: 'fedora',
  arch: 'arch',
  mint: 'mint',
  opensuse: 'opensuse',
  redhat: 'redhat',
  kali: 'kali',
};

function BrandLogo({ name }: { name: string }) {
  const file = LOGO_FILES[name];
  if (!file) return <span style={{ fontSize: 28 }}>🐧</span>;
  return (
    <img
      src={`logos/${file}.svg`}
      alt={`${name}-Logo`}
      className="distro-logo-img"
      loading="lazy"
    />
  );
}

/** Distributions-Karten mit Logo, Basis, Paketmanager und „für wen“. */
export function DistroGrid({ distros }: { distros: DistroEntry[] }) {
  return (
    <div className="distrogrid">
      {distros.map((d) => (
        <div className="distrocard" key={d.name} style={{ borderTopColor: d.accent }}>
          <div className="distro-logo">
            <BrandLogo name={d.logo} />
          </div>
          <div className="distro-body">
            <div className="distro-name">{d.name}</div>
            <div className="distro-meta">
              <span className="distro-based">{d.based}</span>
              <span className="distro-pkg" style={{ color: d.accent }}>{d.pkg}</span>
            </div>
            <p className="distro-desc" dangerouslySetInnerHTML={{ __html: d.desc }} />
            <div className="distro-flavor">👤 {d.flavor}</div>
          </div>
        </div>
      ))}
    </div>
  );
}