import { createDesignTokenGetter } from "@/shared/design-system";
import overrides from "./design-overrides.json" with { type: "json" };

export const getDesignToken = createDesignTokenGetter(overrides);
