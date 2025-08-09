// 050300180101000000000018
// 0000007b
// 00000001
// 0000002a

import { getBytesAtOffset, readNPSHeader } from "./helpers.js";
import { Packet } from "./Packet.js";

/**
 * @implements {Packet}
 */
export class NPSRegisterGameLoginPacket {
    #customerId
    #personaId
    #shardId

    constructor() {
        this.#customerId = 0
        this.#personaId = 0
        this.#shardId = 0
    }

    get packetName() {
        return `NPS_REGISTER_GAME_LOGIN`
    }

    get customerId() {
        return this.#customerId
    }

    get personaId() {
        return this.#personaId
    }

    get shardId() {
        return this.#shardId
    }

    /**
     *
     * @param {Buffer} data
     * @returns {boolean}
     */
    static Matches(data) {
        const messageId = getBytesAtOffset(data, 0, 2).readUInt16BE();
        return messageId === 0x503;
    }

    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {
        console.log(`deserializing ${this.packetName}`)

        const {headerSize, messageLength, body } = readNPSHeader(data)

        const neededLength = messageLength - headerSize
        if (body.length < neededLength) {
            throw new Error(`remaining data does not match expected length. expected ${neededLength} bytes, got ${body.length} bytes`)
        }

        if (body.length < 12) {
            throw new Error(`Not enough data to deserialize. Need 12 bytes, got ${body.length} bytes.`)
        }

        this.#customerId = body.readUInt32BE(0)
        this.#personaId = body.readUInt32BE(4)
        this.#shardId = body.readUInt32BE(8)

        console.log(`recieved game login for customerId ${this.#customerId} using personaId ${this.#personaId} on shardId ${this.#shardId}`)

    }

    /**
     * @returns {Buffer}
     */
    serialize() {
        throw new Error('not yet implemented')
    }

    /**
     * 
     * @param {Buffer} data 
     * @returns {NPSRegisterGameLoginPacket}
     */
    static Parse(data) {
        const self = new NPSRegisterGameLoginPacket()
        self.deserialize(data)
        return self
    }
}