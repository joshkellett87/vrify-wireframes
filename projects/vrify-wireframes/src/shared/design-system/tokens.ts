import baseTokens from "../../../context/design-system.json" with { type: "json" };

type Primitive = string | number | boolean;
type TokenValue = Primitive | Record<string, Primitive>;
type TokenRecord = Record<string, TokenValue>;

export type DesignTokens = typeof baseTokens;

type Override = Partial<DesignTokens>;

/**
 * Merge the base design tokens with an optional override map. Undefined values are skipped;
 * explicit nulls override the base token, so prefer leaving keys absent when you want defaults.
 */
function mergeTokens(base: DesignTokens, override?: Override): DesignTokens {
  if (!override) return base;

  const merged: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(base)) {
    merged[key] = value;
  }

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const baseSection = base[key as keyof DesignTokens];

    if (
      baseSection &&
      typeof baseSection === "object" &&
      !Array.isArray(baseSection) &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      merged[key] = { ...(baseSection as Record<string, Primitive>), ...(value as Record<string, Primitive>) };
    } else {
      merged[key] = value;
    }
  }

  return merged as DesignTokens;
}

export type TokenKey = `${keyof DesignTokens & string}.${string}` | keyof DesignTokens & string;

/**
 * Create a token lookup helper. Keys can reference top-level groups (e.g. "shadow") or
 * dot-delimited entries (e.g. "shadow.sm"). Missing tokens fall back to the provided default.
 */
export function createDesignTokenGetter(override?: Override) {
  const merged = mergeTokens(baseTokens, override);

  return function getToken<T extends Primitive = Primitive>(key: TokenKey, fallback?: T): T {
    const [group, token] = key.split(".");

    if (!group) {
      return (merged as Record<string, T>)[key as keyof DesignTokens & string] ?? fallback ?? ("" as T);
    }

    const groupValue = (merged as Record<string, unknown>)[group];

    if (
      groupValue &&
      typeof groupValue === "object" &&
      !Array.isArray(groupValue) &&
      token in (groupValue as Record<string, unknown>)
    ) {
      return (groupValue as Record<string, T>)[token] ?? fallback ?? ("" as T);
    }

    return fallback ?? ("" as T);
  };
}

export const getBaseDesignToken = createDesignTokenGetter();

/**
 * Return the merged token map – useful for CLI inspection or debugging.
 */
export function listDesignTokens(override?: Override) {
  const merged = mergeTokens(baseTokens, override);
  return merged;
}
