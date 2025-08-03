
import { randomUUID } from "node:crypto"
import { StatusRecord } from "./StatusRecord.js"

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
