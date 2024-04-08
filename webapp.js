import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { createExitSignal, staticServer } from "./backend/server.ts";
import { writeHaiku } from './haiku.js'

const path = new URL(".", import.meta.url).pathname;
// On Windows, the path starts with a "/", which needs to be removed.
// Additionally, replace forward slashes with backward slashes.
const correctedPath = Deno.build.os === "windows" ? path.substring(1).replace(/\//g, "\\") : path;

Deno.chdir(correctedPath);
// log the current working directory with friendly message
console.log(`Current working directory: ${Deno.cwd()}`);

// Setup server
const app = new Application();
const router = new Router();
router.post("/writeHaiku", writeHaiku);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

const port = 1337;
// Start server
console.log(`Listening on http://localhost:${port}`);
await app.listen({ port: port, signal: createExitSignal() });