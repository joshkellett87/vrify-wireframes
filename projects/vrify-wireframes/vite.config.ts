import { createWireframeViteConfig } from "../../packages/wireframe-core/configs/vite.config.base.ts";
import { componentTagger } from "lovable-tagger";

export default createWireframeViteConfig({
  plugins: [componentTagger()],
});
