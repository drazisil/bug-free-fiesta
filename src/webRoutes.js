import { IncomingMessage, ServerResponse } from "node:http";
import { routeAuthLogin } from "./routeAuthLogin.js";



/**
 * @type {{ 
 *  pathMatches: (path: string) => boolean,
 *  routeHandler: (request: IncomingMessage, response: ServerResponse) => void
 * }[]}
 */

export const webRoutes = [{
    pathMatches: (path) => { return path.startsWith("/AuthLogin")},
    routeHandler: routeAuthLogin
}];
