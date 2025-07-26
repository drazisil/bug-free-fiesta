import { IncomingMessage, ServerResponse } from "node:http";
import { routeAuthLogin } from "./routeAuthLogin.js";
import { routeShardList } from "./routeShardList.js";



/**
 * @type {{ 
 *  pathMatches: (path: string) => boolean,
 *  routeHandler: (request: IncomingMessage, response: ServerResponse) => void
 * }[]}
 */

export const webRoutes = [{
    pathMatches: (path) => { return path.startsWith("/AuthLogin")},
    routeHandler: routeAuthLogin
},
{
    pathMatches: (path) => { return path.startsWith("/ShardList/")},
    routeHandler: routeShardList
}];
