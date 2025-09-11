import type { Preset, ThemeKey } from "./types";

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "email",
    name: "Email",
    pattern: String.raw`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b`,
    flags: "giu",
    test: "Contact: john.doe@example.com, fake@mail, admin@sub.domain.org",
    replace: "$&"
  },
  {
    id: "url",
    name: "URL",
    pattern: String.raw`\bhttps?:\/\/[^\s/$.?#].[^\s]*`,
    flags: "giu",
    test: "Docs: https://example.com/docs, http://test.local/page?x=1",
    replace: "$&"
  },
  {
    id: "ipv4",
    name: "IPv4",
    pattern: String.raw`\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b`,
    flags: "g",
    test: "Servers: 127.0.0.1, 256.0.0.1 (invalid), 192.168.1.42",
    replace: "$&"
  },
  {
    id: "iso-date",
    name: "Date ISO (AAAA-MM-JJ)",
    pattern: String.raw`\b(\d{4})-(\d{2})-(\d{2})\b`,
    flags: "g",
    test: "Anniversaires: 2025-09-11, 11-09-2025",
    replace: "$3/$2/$1"
  }
];

export const ALLOWED_FLAGS = ["g", "i", "m", "s", "u", "y", "d"] as const;

export const THEME_ORDER: ThemeKey[] = ["custom", "email", "password", "url", "ipv4", "date"];
