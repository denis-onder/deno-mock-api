import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

type DBConnectorFunc = () => any;

type DBClient = {
  query: (query: string) => any;
};

class Service {
  private _db: DBClient = { query: (s) => s };
  constructor(dbConnector: DBConnectorFunc) {
    (async () => (this._db = await dbConnector()))();
  }
  public async getAllUsers(req: ServerRequest) {
    const { rows } = await this._db.query("SELECT * FROM users");
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(rows),
    });
  }
  public async getUserByID(req: ServerRequest) {
    // Parse the params out of the URL
    const [_, id] = req.url.split("/users/id/");
    const { rows } = await this._db.query(
      `SELECT * FROM users WHERE id = ${id}`
    );
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(rows),
    });
  }
}

export { Service };

export default (dbConnector: DBConnectorFunc) => new Service(dbConnector);
