{ pkgs }: {
  deps = [
    # Node.js 20 LTS
    pkgs.nodejs_20

    # npm and package management
    pkgs.nodePackages.npm
    pkgs.nodePackages.pnpm

    # Build tools
    pkgs.nodePackages.typescript
    pkgs.nodePackages.vite

    # Git for version control
    pkgs.git

    # Additional utilities
    pkgs.curl
    pkgs.jq
  ];

  env = {
    # Ensure correct Node.js version
    NODE_VERSION = "20";
  };
}
