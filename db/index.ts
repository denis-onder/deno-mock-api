import { Client } from "https://deno.land/x/postgres/mod.ts";

const client: Client = new Client(
  "postgres://postgres:postgres@localhost:5432/denomock"
);
await client.connect();
export default client;
