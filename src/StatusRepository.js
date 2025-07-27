
/**
 * @typedef StatusRecord
 * @property {number} customerId
 * @property {string} sessionToken
 */

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

        activeSessions.set(customerId, {
            customerId, 
            sessionToken,
        })

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

}
