import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // The CLI (migrate/introspect/studio) uses this url directly — point it at
  // Neon's unpooled connection. The pooled DATABASE_URL is used separately by
  // the runtime PrismaClient in lib/prisma.ts via its own adapter instance;
  // Prisma 7 removed `directUrl` from this config, so the two are no longer
  // wired together here.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
