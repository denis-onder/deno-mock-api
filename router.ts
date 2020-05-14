import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

type RouteCallback = (req: ServerRequest) => any;

type Route = {
  endpoint: string;
  method: HTTPMethod;
  callback: RouteCallback;
};

type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE";

class Router {
  private _routes: Map<string, Route> = new Map();

  public isDefined(method: string, endpoint: string) {
    const route = this._routes.get(endpoint);
    return route && route.method == method;
  }

  public define(method: HTTPMethod, endpoint: string, callback: RouteCallback) {
    this._routes.set(endpoint, { method, endpoint, callback });
  }

  public handle(req: ServerRequest) {
    const route = this._routes.get(req.url);

    if (!route)
      throw Error(
        `Route ${req.url} is not defined.\nPlease use Router.define() to create your route.`
      );

    route.callback(req);
  }
}

export default new Router();
