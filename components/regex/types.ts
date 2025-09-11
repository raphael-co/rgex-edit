export type Preset = {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  test: string;
  replace?: string;
};

export type MatchRow = {
  index: number;
  start: number;
  end: number;
  match: string;
  groups: Record<string, string | undefined>;
  numberedGroups: Array<string | undefined>;
};

export type ThemeKey = "custom" | "email" | "password" | "url" | "ipv4" | "date";
