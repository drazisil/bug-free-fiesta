import { NPSUserLoginPacket } from "./NPSUserLoginPacket.js";
import { Packet } from "./Packet.js";
import { StatusRepository } from "./StatusRepository.js";



/**
 *
 * @param {Packet} packet
 * @param {import("./helpers.js").TaggedSocket} connectionSocket 
 * @returns {null}
 */
export function handlePacket(packet, connectionSocket) { 

    console.log(`Handling packet for customer "${connectionSocket.customerId}"`)
    
    if (packet instanceof NPSUserLoginPacket) {
        connectionSocket.customerId = packet.customerId
        console.log(`Updated connection socket with customer id ${connectionSocket.customerId}`)
    }
    
    // There is no way that the session key should not already be set on the server status at this point
    const statusRepository = new StatusRepository()

    const user = statusRepository.getUserSession(connectionSocket.customerId)

    if (user === null) {
        throw new Error(`Unable to locate session for customer id "${connectionSocket.customerId}"`)
    }

    if (!user.isKeySet()) {
        throw new Error(`Reached handle packet but session key was not set for customer id ${user.customerId}`)
    }

    console.log(`Verified that user "${user.customerId}" has the session key set`)

    connectionSocket.socket.end()

    return null

}
