import { ServerResponse } from "node:http";
import { Socket } from "node:net";

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
 * @returns {{messageId: number, headerSize: number, messageLength: number, body: Buffer}}
 */
export function readNPSHeader(data) {
    let headerSize;    

    if (data.length < 4) {
        throw new Error('Not enough data to read header')
    }

    if (data.length >= 12 && data.readUInt16BE(4) === 0x0101) {
        headerSize = 12
    } else {
        headerSize = 4
    }


    const messageId = data.readUint16BE(0)
    const messageLength = data.readUint16BE(2)
    const body = Buffer.from(data.subarray(headerSize))
    return {
        messageId,
        headerSize,
        messageLength,
        body
    }
}

/**
 * 
 * @param {number} messageId 
 * @param {Buffer} body 
 * @returns {Buffer}
 */
export function writeNPSHeader(messageId, body) {
    const headerBuffer = Buffer.alloc(12)
    const extraBytes = Buffer.alloc(12 + body.length % 8)
    headerBuffer.writeUInt16BE(messageId)
    headerBuffer.writeUInt16BE(body.length + 12 + extraBytes.length, 2)
    headerBuffer.writeUInt16BE(257, 4)
    headerBuffer.writeUInt16BE(0, 6)
    headerBuffer.writeUInt32BE(body.length + 12 + extraBytes.length, 8)


    return Buffer.concat([headerBuffer, body, extraBytes])
}

/**
 *
 * @param {Buffer} data
 * @param {2 | 4} prefixSize
 * @returns {{value: Buffer, remainingBody: Buffer}}
 */
export function getNextPrefixedValue(data, prefixSize = 2) {
    let remainingBody = data;

    if (remainingBody.length < prefixSize) {
        throw new Error(`not enough bytes to get length. need ${prefixSize}, got ${remainingBody.length}`);

    }

    let nextLength

    if (prefixSize === 4) {
        
        nextLength = remainingBody.readUInt32BE();
    } else {
        nextLength = remainingBody.readUInt16BE();
    }

    remainingBody = remainingBody.subarray(prefixSize);

    if (remainingBody.length < nextLength) {
        throw new Error(`Not enough data for next value. need ${nextLength}, got ${remainingBody.length}`);

    }

    const value = remainingBody.subarray(0, nextLength);

    return {
        value,
        remainingBody: Buffer.from(remainingBody.subarray(nextLength))
    };
}

/**
 * 
 * @param {Buffer} buffer 
 * @param {Buffer} value 
 * @param {number} offset
 * @returns {{nextOffset: number, buffer: Buffer}} length byte written
 */
export function writeNextPrefixedValue(buffer, value, offset) {

    const length = value.byteLength

    const nextOffset = offset + length + 2

    if (buffer.byteLength < nextOffset) {
        throw new Error(`Unable to write value, net enough space left in buffer. Need ${nextOffset} bytes, got ${buffer.byteLength} bytes`)
    }

    buffer.writeUInt16BE(length, offset)
    value.copy(buffer, offset + 2)

    return {
        nextOffset,
        buffer
    }

}

/**
 * 
 * @param {Buffer} buffer
 * @param {boolean} b
 * @param {number} offset
 * @returns {{nextOffset: number, buffer: Buffer}} next offset, and buffer with value written
 */
export function writeShortBool(buffer, b, offset) {
    const value = b === true ? 1 : 0
    const nextOffset = offset + 2

    if (buffer.byteLength < nextOffset) {
        throw new Error(`Unable to write value, net enough space left in buffer. Need ${nextOffset} bytes, got ${buffer.byteLength} bytes`)
    }

    buffer.writeUInt16BE(value, offset)

    return {
        nextOffset,
        buffer
    }

}

/**
 * Rounds a number up to the nearest multiple of 4 using bitwise operations
 * @param {number} num - The number to round up
 * @returns {number} The number rounded up to the nearest multiple of 4
 */
export function align4(num) {
    return (num + 3) & ~3;
}
/**
 *
 * @param {Buffer} body
 * @param {number} neededLength
 * @param {string} fieldName
 */
export function ensureSufficientData(body, neededLength, fieldName) {
    if (body.length < neededLength) {
        throw new Error(`not enough data for ${fieldName}. need ${neededLength} bytes, got ${body.length} bytes`);
    }
}

/**
 * @typedef TaggedSocket
 * @property {number} customerId
 * @property {{read: () => Buffer, write: (data: Buffer) => void, end: () => void}} socket
 */

