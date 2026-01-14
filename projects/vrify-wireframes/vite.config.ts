import { createWireframeViteConfig } from "@wireframe/core/configs/vite";
import { componentTagger } from "lovable-tagger";

export default createWireframeViteConfig({
  plugins: [componentTagger()],
});
