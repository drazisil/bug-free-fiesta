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

/**
 * 
 * @param {Buffer} data 
 * @returns {{messageId: number, messageLength: number, body: Buffer}}
 */
export function readNPSHeader(data) {
    if (data.length < 12) {
        throw new Error('Not enough data to read header')
    }
    const messageId = data.readUint16BE(0)
    const messageLength = data.readUint16BE(2)
    const body = Buffer.from(data.subarray(12))
    return {
        messageId,
        messageLength,
        body
    }
}
/**
 *
 * @param {Buffer} data
 * @returns {{value: Buffer, remainingBody: Buffer}}
 */
export function getNextPrefixedValue(data) {
    let remainingBody = data;

    if (remainingBody.length < 2) {
        throw new Error('not enough bytes to get length');

    }

    let nextLength = remainingBody.readUInt16BE();
    remainingBody = remainingBody.subarray(2);

    if (remainingBody.length < nextLength) {
        throw new Error(`Not enough data for next value. need ${nextLength}, got ${remainingBody.length}`);

    }

    const value = remainingBody.subarray(0, nextLength);

    return {
        value,
        remainingBody
    };


}

