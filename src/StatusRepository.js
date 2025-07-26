
/**
 * @typedef StatusRecord
 * @property {number} customerId
 * @property {string} sessionToken
 */

import { randomUUID } from "node:crypto"

/**
 * @type {Map<number, StatusRecord}
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

}
