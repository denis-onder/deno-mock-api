import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { Service } from "./service.ts";

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
  private _service: Service;

  constructor(service: Service) {
    this._service = service;
  }

  public isDefined({ method, url: endpoint }: ServerRequest) {
    const route = this._routes.get(endpoint);
    return route && route.method == method;
  }

  public define(method: HTTPMethod, endpoint: string, callback: RouteCallback) {
    this._routes.set(endpoint, { method, endpoint, callback });
  }

  public handleStrict(req: ServerRequest) {
    const route = this._routes.get(req.url);

    if (!route)
      throw Error(
        `Route ${req.url} is not defined.\nPlease use Router.define() to create your route.`
      );

    route.callback(req);
  }

  public handleNonStrict(req: ServerRequest) {
    const { url: endpoint } = req;
    if (endpoint.includes("/users/id/")) this._service.getUserByID(req);
  }
}

export default (service: Service) => new Router(service);
