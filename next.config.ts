import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Built as plain static files (`out/`) so it can be served from a static
  // host like Render. This rules out server-only features: API routes,
  // middleware, server actions, and dynamic `[param]` routes (pass IDs as
  // query strings instead, e.g. /examai/interactions/view?id=...).
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
