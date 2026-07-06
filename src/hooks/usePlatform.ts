import { useMemo } from 'react';

export type Platform = 'mac' | 'windows' | 'linux' | 'other';

/** Erkennt die Plattform anhand von navigator.platform / userAgent.
 *  Wird einmal pro Mount berechnet, danach konstant. */
export function usePlatform(): Platform {
  return useMemo(() => detectPlatform(), []);
}

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const p = (navigator.platform ?? '') + ' ' + (navigator.userAgent ?? '');
  const lower = p.toLowerCase();
  // Reihenfolge wichtig: Mac vor Win vor Linux
  if (lower.includes('mac') || lower.includes('darwin') || lower.includes('iphone') || lower.includes('ipad')) return 'mac';
  if (lower.includes('win')) return 'windows';
  if (lower.includes('linux')) return 'linux';
  return 'other';
}

/** Liefert das Tastenkürzel-Label für Cmd/Ctrl je nach Plattform. */
export function modKey(platform: Platform): string {
  switch (platform) {
    case 'mac': return '⌘';
    case 'windows':
    case 'linux':
    case 'other': return 'Ctrl';
  }
}

/** Shortcut-String für ⌘K / Ctrl+K */
export function paletteShortcut(platform: Platform): string {
  return `${modKey(platform)}K`;
}