import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
import createRouter from "./router.ts";
import createDBClient from "./db/index.ts";
import createService from "./services/user.service.ts";

const dbClient = createDBClient();
const service = createService(dbClient);
const router = createRouter(service);

// Define strict routes
// router.define("GET", "/users/all", service.getAllUsers); // FIXME: Fix the database being innacessible within predefined routes

const port = Deno.args[0] || 8000;

const s = serve({ port: 8000 });
console.log(`Server running!\nhttp://localhost:${port}/`);

for await (const req of s) {
  let response: any = {};
  // Strictly defined routes w/ no parameters
  if (router.isDefined(req)) response = await router.handleStrict(req);
  // Handle non-strict routes
  response = router.handleNonStrict(req);
}
