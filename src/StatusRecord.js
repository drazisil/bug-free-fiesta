class UserAction {

    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {
        // NOOP
    }

    /**
     * @returns {Buffer}
     */
    serialize() {

        // We need two bytes for the length
        const neededLength = this.sizeOf
        const buffer = Buffer.alloc(neededLength)

        return buffer

    }

    get sizeOf() {
        return 2
    }
}

export class StatusRecord {
    #customerId;
    #sessionToken;
    /**
     * @type {string | null}
     */
    #sessionKey;
    /**
     * @type {UserAction | null}
     */
    #banRecord
    /**
     * @type {UserAction | null}
     */
    #muteRecord


    /**
     *
     * @param {number} customerId
     * @param {string} sessionToken
     */
    constructor(customerId, sessionToken) {
        this.#customerId = customerId;
        this.#sessionToken = sessionToken;
        this.#sessionKey = null;
        this.#banRecord = null
        this.#muteRecord = null
    }

    get customerId() {
        return this.#customerId;
    }

    get sessionToken() {
        return this.#sessionToken;
    }

    /**
     *
     * @param {string} sessionKey
     */
    setSessionKey(sessionKey) {
        if (this.#sessionKey !== null) {
            throw new Error(`session key alread set for customer ${this.#customerId}`);
        }
        this.#sessionKey = sessionKey;
    }

    /**
     * @returns {boolean}
     */
    isKeySet() {
        return this.#sessionKey !== null;
    }

    isBanned() {
        return this.#banRecord !== null
    }

    isMuted() {
        return this.#muteRecord !== null
    }

    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {
        // TODO: Impliment, throw for now
        throw new Error(`deserialize not implemented yet`)
    }

    get sizeOf() {
        return (
            4 // CustomerId
            + 4 // personaId
            + 1 // isCacheHit
            + (this.#banRecord !== null ? this.#banRecord?.sizeOf : 1)
            + (this.#muteRecord !== null ? this.#muteRecord.sizeOf : 1)
            + 2 // This is the sessionKey. I don't know I'm actually supposed to send it back though, we shall see
            + 4 // Unknown value
            + 4 // Metrics id, not used
        )

    }

    /**
     * @returns {Buffer}
     */
    serialize() {

        const buffer = Buffer.alloc(this.sizeOf)

        buffer.writeUInt32BE(this.#customerId)
        buffer.writeUInt32BE(0, 4)
        buffer.writeUInt8(0, 8)
        let offset = 9
        if (this.#banRecord !== null) {
            buffer.copy(this.#banRecord.serialize(), offset)
            offset += this.#banRecord.sizeOf
        } else {
            offset += 1
        }
        if (this.#muteRecord !== null) {
            buffer.copy(this.#muteRecord.serialize())
            offset += this.#muteRecord.sizeOf
        } else {
            offset += 1
        }

        buffer.write("", offset)

        // Just ignoring the rest

        return buffer



    }
}
