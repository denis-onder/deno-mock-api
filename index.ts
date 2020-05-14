import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
import createRouter from "./router.ts";
import dbClient from "./db/index.ts";
import createService from "./services/user.service.ts";

const service = createService(dbClient);
const router = createRouter(service);

// Define strict routes
router.define("GET", "/users/all", service.getAllUsers);

const port = Deno.args[0] || 8000;

const s = serve({ port: 8000 });
console.log(`Server running!\nhttp://localhost:${port}/`);

for await (const req of s) {
  // Strictly defined routes w/ no parameters
  if (router.isDefined(req)) router.handleStrict(req);
  // Handle non-strict routes
  router.handleNonStrict(req);
}
