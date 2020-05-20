import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { DBClient } from "../db/index.ts";
import createUserEntity from "../enitities/user.enitity.ts";

class UserService {
  private _db: DBClient;

  constructor(dbClient: DBClient) {
    this._db = dbClient;
  }

  public async getAllUsers(req: ServerRequest) {
    try {
      const res = await this._db.query("SELECT * FROM users");

      return req.respond({
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
        }),
        body: JSON.stringify(this.generateResponse(res)),
      });
    } catch (error) {
      console.error(error);
    }
  }

  private generateResponse(res: any) {
    const { rowDescription: _, rows } = res;
    const { columns } = _;

    let output = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      let obj: any = {};

      for (let j = 0; j < row.length; j++) {
        obj[columns[j].name] = row[j];
      }

      output.push(obj);
    }

    return output.length > 0 ? output : output[0];
  }

  public async getUserByID(req: ServerRequest) {
    try {
      // Parse the params out of the URL
      const [_, id] = req.url.split("/users/id/");
      const res = await this._db.query(`SELECT * FROM users WHERE id = ${id}`);

      return req.respond({
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
        }),
        body: JSON.stringify(this.generateResponse(res)),
      });
    } catch (error) {
      console.error(error);
    }
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
    try {
      let res;

      const [_, params] = req.url.split("/users/add?");

      const newUser = createUserEntity(this.generatePayload(params.split("?")));

      if (newUser.valid) {
        const { firstname, lastname, email, age, phonenumber } = newUser.data;
        res = await this._db.query(
          "INSERT INTO users (firstname, lastname, email, age, phonenumber) VALUES ($1, $2, $3, $4, $5)",
          firstname,
          lastname,
          email,
          parseInt(age),
          parseInt(phonenumber)
        );
      }

      console.log(res.query);

      return req.respond({
        headers: new Headers({
          "content-type": "application/json",
        }),
        status: newUser.valid ? 200 : 400,
        body: JSON.stringify(newUser),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export { UserService };

export default (dbClient: DBClient) => new UserService(dbClient);
