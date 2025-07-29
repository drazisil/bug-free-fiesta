
export class StatusRecord {
    #customerId
    #sessionToken
    /**
     * @type {string | null}
     */
    #sessionKey


    /**
     * 
     * @param {number} customerId 
     * @param {string} sessionToken 
     */
    constructor(customerId, sessionToken) {
        this.#customerId = customerId
        this.#sessionToken = sessionToken
        this.#sessionKey = null
    }

    get customerId() {
        return this.#customerId
    }

    get sessionToken() {
        return this.#sessionToken
    }

    /**
     * 
     * @param {string} sessionKey 
     */
    setSessionKey(sessionKey) {
        if (this.#sessionKey !== null) {
            throw new Error(`session key alread set for customer ${this.#customerId}`)
        }
        this.#sessionKey = sessionKey
    }

    /**
     * @returns {boolean}
     */
    isKeySet() {
        return this.#sessionKey !== null
    }
}

import { randomUUID } from "node:crypto"

/**
 * @type {Map<number, StatusRecord>}
 */
const activeSessions = new Map()

export class StatusRepository {

    /**
     * 
     * @param {number} customerId 
     * @returns {string}
     */
    createSession(customerId) {
        const sessionToken = randomUUID()

        activeSessions.set(customerId, new StatusRecord(customerId,
            sessionToken))

        return sessionToken
    }

    /**
     * 
     * @param {string} sessionToken 
     * @returns {StatusRecord | null}
     */
    getSession(sessionToken) {

        for (const session of activeSessions.values()) {
            if (session.sessionToken === sessionToken) {
                return session
            }
        }
        return null

    }

    /**
     * 
     * @param {number} customerId
     * @returns {StatusRecord | null}
     */
    getUserSession(customerId) {
                for (const session of activeSessions.values()) {
            if (session.customerId === customerId) {
                return session
            }
        }
        return null

    }

    /**
     * 
     * @param {number} customerId 
     * @param {StatusRecord} statusRecord 
     */
    updateSession(customerId, statusRecord) {
        activeSessions.set(customerId, statusRecord)
    }

}
