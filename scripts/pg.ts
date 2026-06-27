// Starts a self-contained local PostgreSQL (no system install required).
// Keeps running until the process is terminated. Used for local demos.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";
import path from "path";

const DATABASE_DIR = path.join(process.cwd(), ".pgdata");
const DB_NAME = "financing_in_canada";

async function main() {
  const alreadyInitialised = existsSync(path.join(DATABASE_DIR, "PG_VERSION"));

  const pg = new EmbeddedPostgres({
    databaseDir: DATABASE_DIR,
    user: "postgres",
    password: "postgres",
    port: 5432,
    persistent: true,
  });

  if (!alreadyInitialised) {
    console.log("⏳ Initialising embedded PostgreSQL data directory…");
    await pg.initialise();
  }

  console.log("⏳ Starting PostgreSQL on localhost:5432…");
  await pg.start();

  try {
    await pg.createDatabase(DB_NAME);
    console.log(`✅ Created database "${DB_NAME}".`);
  } catch {
    console.log(`ℹ️  Database "${DB_NAME}" already exists.`);
  }

  console.log("✅ PostgreSQL is running. Leave this process open.");

  const shutdown = async () => {
    console.log("\n⏹  Stopping PostgreSQL…");
    try {
      await pg.stop();
    } finally {
      process.exit(0);
    }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  // Keep the process alive.
  setInterval(() => {}, 1 << 30);
}

main().catch((err) => {
  console.error("❌ Failed to start embedded PostgreSQL:", err);
  process.exit(1);
});
