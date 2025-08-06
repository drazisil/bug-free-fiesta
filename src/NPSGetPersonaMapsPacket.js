import { getBytesAtOffset, readNPSHeader } from "./helpers.js";
import { Packet } from "./Packet.js";


/**
 * @implements {Packet}
 */

export class NPSGetPersonaMapsPacket {
    #customerId;

    constructor() {
        this.#customerId = -1;
    }

    get packetName() {
        return 'NPS_GET_PERSONA_MAPS';
    }

    get customerId() {
        return this.#customerId
    }

    /**
     *
     * @param {Buffer} data
     * @returns {boolean}
     */
    static Matches(data) {
        const messageId = getBytesAtOffset(data, 0, 2).readUInt16BE();
        return messageId === 0x532;
    }

    /**
     *
     * @param {Buffer} data
     */
    deserialize(data) {
        console.log(`deserializing ${this.packetName}`);

        let nextLength = 0;
        let r;

        const { messageId, messageLength, body } = readNPSHeader(data);

        const dataRemaining = data.length - 12;
        if (dataRemaining < 4) {
            throw new Error(`Not enough data, need 4, got ${dataRemaining}`);
        }

        this.#customerId = data.subarray(12).readUInt32BE();

        console.log(`Request for for customer ${this.#customerId}`);
    }

    /**
     * @returns {Buffer}
     */
    serialize() {
        throw new Error('Not yet implemented');
    }

    /**
 *
 * @param {Buffer} data
 * @returns {NPSGetPersonaMapsPacket}
 */
    static Parse(data) {
        const self = new NPSGetPersonaMapsPacket();
        self.deserialize(data);
        return self;
    }
}
