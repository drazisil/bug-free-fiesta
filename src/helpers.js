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

/**
 *
 * @param {Buffer} data
 * @param {number} start
 * @param {number} len
 * @returns {Buffer}
 */
export function getBytesAtOffset(data, start, len) {
    const neededLength = start + len;
    if (data.length < neededLength) {
        throw new Error(`Data does not contain ${neededLength} bytes`);
    }

    return Buffer.from(data.subarray(start, neededLength));
}

