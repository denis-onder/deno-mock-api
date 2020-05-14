import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.50.0/http/server.ts";
import createRouter from "./router.ts";
import dbConnector from "./db.ts";
import createService from "./service.ts";

export const service = createService(dbConnector);
const router = createRouter(service);

// Define routes
router.define("GET", "/users/all", service.getAllUsers);
router.define("POST", "/users/new", service.addUser);

const port = Deno.args[0] || 8000;

const s = serve({ port: 8000 });
console.log(`Server running!\nhttp://localhost:${port}/`);

for await (const req of s) {
  // Strictly defined routes w/ no parameters
  if (router.isDefined(req)) router.handleStrict(req);
  // Handle non-strict routes
  router.handleNonStrict(req);
}
