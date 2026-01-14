import { createWireframeTailwindConfig } from "@wireframe/core/configs/tailwind";

export default createWireframeTailwindConfig({
  theme: {
    extend: {
      colors: {
        wireframe: {
          box: "hsl(0 0% 90%)",
          text: "hsl(0 0% 60%)",
          divider: "hsl(0 0% 85%)",
          placeholder: "hsl(0 0% 75%)",
          border: "hsl(0 0% 70%)",
          bg: "hsl(0 0% 94%)",
        },
      },
    },
  },
});
