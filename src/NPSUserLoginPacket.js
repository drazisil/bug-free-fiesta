import { Cipheriv, createCipheriv, Decipheriv } from "node:crypto";
import { getBytesAtOffset, getNextPrefixedValue, readNPSHeader } from "./helpers.js";
import { Packet } from "./Packet.js"
import { StatusRepository } from "./StatusRepository.js";
import { KeyRepository } from "./KeyRepository.js";

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

        const { messageId, messageLength, body } = readNPSHeader(data)

        if (body.length !== messageLength - 12) {
            console.log(`Error parsing header, body is ${body.length} bytes, expected ${messageLength - 12} bytes`)
            return
        }

        let nextLength = 0
        let r

        r = getNextPrefixedValue(body)

        let value = r.value
        let remainingBody = r.remainingBody

        this.sessionToken = value

        console.log(`Session token: ${this.sessionToken}`)

        // Skip the empty container header
        remainingBody = remainingBody.subarray(2)

        if (remainingBody.length < 2) {
            console.log('not enough bytes to get length')
            return
        }

        nextLength = remainingBody.readUint16BE()

        const statusRepository = new StatusRepository()

        const user = statusRepository.getSession(this.sessionToken.toString("utf8"))

        if (user === null) {
            throw new Error(`unable to find active session for token "${this.sessionToken.toString("utf8")}"`)
        }

        console.log(`located customerId ${user.customerId} for token ${this.sessionToken.toString("utf8")}`)

        r = getNextPrefixedValue(remainingBody)
        value = r.value
        remainingBody = r.remainingBody

        this.sessionKey = value

        const keyRepository = new KeyRepository('data/private_key.pem')

        keyRepository.parseKey(user.customerId, value)



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
