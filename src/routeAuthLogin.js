import { IncomingMessage, ServerResponse } from "node:http";

/**
 *
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */
export function routeAuthLogin(request, response) {
    console.log("yes");
    response.statusCode = 400
    response.end('Invalid')
}
