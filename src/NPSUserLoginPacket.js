import { getBytesAtOffset } from "./helpers.js";
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
