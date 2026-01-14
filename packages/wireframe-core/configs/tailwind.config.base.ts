import tailwindcssAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...target };
  for (const [key, value] of Object.entries(source)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export type WireframeTailwindOptions = Partial<Config>;

export function createWireframeTailwindConfig(overrides: WireframeTailwindOptions = {}): Config {
  const { content = [], theme, plugins = [], ...rest } = overrides;
  const extend = theme?.extend ?? {};
  const {
    colors = {},
    spacing = {},
    fontSize = {},
    borderRadius = {},
    keyframes = {},
    animation = {},
    transitionTimingFunction = {},
    fontFamily = {},
    ...extendRest
  } = extend;

  return {
    darkMode: ["class"],
    content: ["./src/**/*.{ts,tsx}", "./node_modules/@wireframe/core/src/**/*.{ts,tsx}", ...content],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        fontFamily: {
          inter: ["Inter", "sans-serif"],
          "plex-mono": ["IBM Plex Mono", "monospace"],
          ...fontFamily,
        },
        colors: deepMerge(
          {
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            wireframe: {
              50: "hsl(var(--wireframe-50))",
              100: "hsl(var(--wireframe-100))",
              200: "hsl(var(--wireframe-200))",
              300: "hsl(var(--wireframe-300))",
              400: "hsl(var(--wireframe-400))",
              500: "hsl(var(--wireframe-500))",
              600: "hsl(var(--wireframe-600))",
              700: "hsl(var(--wireframe-700))",
              800: "hsl(var(--wireframe-800))",
              900: "hsl(var(--wireframe-900))",
            },
            primary: {
              DEFAULT: "hsl(var(--primary))",
              foreground: "hsl(var(--primary-foreground))",
              hover: "hsl(var(--primary-hover))",
            },
            secondary: {
              DEFAULT: "hsl(var(--secondary))",
              foreground: "hsl(var(--secondary-foreground))",
              hover: "hsl(var(--secondary-hover))",
            },
            muted: {
              DEFAULT: "hsl(var(--muted))",
              foreground: "hsl(var(--muted-foreground))",
            },
            accent: {
              DEFAULT: "hsl(var(--accent))",
              foreground: "hsl(var(--accent-foreground))",
            },
            card: {
              DEFAULT: "hsl(var(--card))",
              foreground: "hsl(var(--card-foreground))",
              border: "hsl(var(--card-border))",
            },
            annotation: "hsl(var(--annotation))",
            placeholder: "hsl(var(--placeholder))",
          },
          colors as Record<string, unknown>,
        ),
        spacing: {
          1: "var(--space-1)",
          2: "var(--space-2)",
          3: "var(--space-3)",
          4: "var(--space-4)",
          6: "var(--space-6)",
          8: "var(--space-8)",
          12: "var(--space-12)",
          16: "var(--space-16)",
          ...spacing,
        },
        fontSize: {
          xs: "var(--text-xs)",
          sm: "var(--text-sm)",
          base: "var(--text-base)",
          lg: "var(--text-lg)",
          xl: "var(--text-xl)",
          "2xl": "var(--text-2xl)",
          "3xl": "var(--text-3xl)",
          "4xl": "var(--text-4xl)",
          ...fontSize,
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
          ...borderRadius,
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          ...keyframes,
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          ...animation,
        },
        transitionTimingFunction: {
          platform: "cubic-bezier(0.4, 0, 0.2, 1)",
          ...transitionTimingFunction,
        },
        ...extendRest,
      },
    },
    plugins: [tailwindcssAnimate, ...plugins],
    ...rest,
  };
}
