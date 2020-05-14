import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import createUserEntity from "../enitities/user.enitity.ts";

type DBConnectorFunc = () => any;

type DBClient = {
  query: (query: string, ...args: any) => any;
};

class UserService {
  private _db: DBClient = { query: (s) => s };

  constructor(dbConnector: DBConnectorFunc) {
    (async () => (this._db = await dbConnector()))();
  }

  public async getAllUsers(req: ServerRequest) {
    const { rows } = await this._db.query("SELECT * FROM users");

    return req.respond({
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

    return req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify(rows),
    });
  }

  private generatePayload(params: Array<string>) {
    let output: any = {};

    // Convert the array into an object
    params.forEach((p) => {
      const [param, value] = p.split("=");
      output[param] = value;
    });

    return output;
  }

  public async addUser(req: ServerRequest) {
    req.headers.set("content-type", "application/json");

    let res;

    const [_, params] = req.url.split("/users/add?");

    const newUser = createUserEntity(this.generatePayload(params.split("?")));

    if (newUser.valid) {
      const { firstname, lastname, email, age, phonenumber } = newUser.data;
      console.log(newUser.data);
      res = await this._db.query(
        "INSERT INTO users (firstname, lastname, email, age, phonenumber) VALUES ($1, $2, $3, $4, $5)",
        firstname,
        lastname,
        email,
        parseInt(age),
        parseInt(phonenumber)
      );
    }

    console.log(res.rows);

    return req.respond({
      status: newUser.valid ? 200 : 400,
      body: JSON.stringify(newUser),
    });
  }
}

export { UserService };

export default (dbConnector: DBConnectorFunc) => new UserService(dbConnector);
