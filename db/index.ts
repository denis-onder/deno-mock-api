import { Client } from "https://deno.land/x/postgres/mod.ts";

export type DBClient = {
  query: (query: string, ...args: any) => any;
  connect: () => void;
};

const client: DBClient = new Client( // The Client constructor returns any for some reason
  "postgres://postgres:postgres@localhost:5432/denomock"
);
await client.connect();

export default () => Object.freeze(client);
