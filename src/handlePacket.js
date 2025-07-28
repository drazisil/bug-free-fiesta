import { Packet } from "./Packet.js";



/**
 *
 * @param {Packet} packet
 * @param {import("./helpers.js").TaggedSocket} connectionSocket 
 * @returns {Packet | null}
 */
export function handlePacket(packet, connectionSocket) { 

    console.log(`Handling packet for customer "${connectionSocket.customerId}"`)

    connectionSocket.socket.end()

    return null

}
