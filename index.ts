import {
  serve,
  ServerRequest,
} from "https://deno.land/std@0.50.0/http/server.ts";
import router from "./router.ts";
import connectToDB from "./db.ts";

const port = Deno.args[0] || 8000;
const s = serve({ port: 8000 });

console.log(`Server running!\nhttp://localhost:${port}/`);

router.define("GET", "/test", (req: ServerRequest) => console.log(req.body));

const db = await connectToDB();

for await (const req of s) {
  if (router.isDefined(req)) router.handle(req);
}
