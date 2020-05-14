import { Client } from "https://deno.land/x/postgres/mod.ts";

export default async () => {
  try {
    const client: Client = new Client(
      "postgres://postgres:postgres@localhost:5432/denomock"
    );
    await client.connect();
    console.log("Database connection established");
    return client;
  } catch (error) {
    console.error(`db.ts`, error);
  }
};
