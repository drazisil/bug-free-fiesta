import { ServerResponse } from "node:http";

/**
 *
 * @param {ServerResponse} response
 * @param {number} code
 * @param {string} message
 */
export function sendResponse(response, code, message) {
    response.statusCode = code;
    response.setHeader("content-type", "text/plain");
    response.end(message);

}
