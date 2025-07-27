import { getBytesAtOffset, getNextPrefixedValue, readNPSHeader } from "./helpers.js";
import {Packet} from "./Packet.js"


/**
 * @implements {Packet}
 */

export class NPSUserLoginPacket {

    get packetName() {
        return 'NPS_USER_LOGIN';
    }

    /**
     *
     * @param {Buffer} data
     * @returns {boolean}
     */
    static Matches(data) {
        const messageId = getBytesAtOffset(data, 0, 2).readUInt16BE()
        return messageId === 0x501;
    }

    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {
        console.log(`deserializing ${this.packetName}`)

        const {messageId, messageLength, body} = readNPSHeader(data)

        if (body.length !== messageLength - 12) {
            console.log(`Error parsing header, body is ${body.length} bytes, expected ${messageLength - 12} bytes`)
            return
        }

        let nextLength = 0

        let { value, remainingBody} = getNextPrefixedValue(body)

        this.sessionToken = value
        
        console.log(`Session token: ${this.sessionToken}`)

        // Skip the empty container header
        remainingBody = remainingBody.subarray(4)

        if (remainingBody.length < 2) {
            console.log('not enough bytes to get length')
            return
        }

        nextLength = remainingBody.readUint16BE()
    }

    /**
     * 
     * @returns {Buffer}
     */
    serialize() {
        console.log(`serializing ${this.packetName}`)
        return Buffer.alloc(0)
    }


    /**
     * 
     * @param {Buffer} data 
     * @returns {NPSUserLoginPacket}
     */
    static Parse(data) {
        const self = new NPSUserLoginPacket()        
        self.deserialize(data)
        return self
     }
}
