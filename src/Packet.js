/**
 * @interface Packet
 */
export class Packet {

    /**
     * @abstract
     * @returns {string}
     */
    get packetName() {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     * @param {Buffer} data
     * @returns {boolean}
     */
    static Matches(data) {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     * @param {Buffer} data 
    */
    deserialize(data) {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     * @returns {Buffer}
     */
    serialize() {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     * @param {Buffer} data
     * @returns {Packet}
     */
    static Parse(data) {
        throw new Error('method must be implemented in subclass');
    }
}


