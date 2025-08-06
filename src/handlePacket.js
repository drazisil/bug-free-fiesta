import { Socket } from "node:net";
import { writeNPSHeader } from "./helpers.js";
import { NPSUserLoginPacket } from "./NPSUserLoginPacket.js";
import { Packet } from "./Packet.js";
import { StatusRepository } from "./StatusRepository.js";
import { NPSGetPersonaMapsPacket } from "./NPSGetPersonaMapsPacket.js";
import { UserGameData } from "./UserGameData.js";



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
    
    const user = getUserSessionFromSocket(connectionSocket);

    if (packet instanceof NPSUserLoginPacket) {
        if (typeof user === "undefined") {
            throw new Error(`User is undefined! Something went wrong with tagging`)
        }


        const response = writeNPSHeader(0x601, user.serialize())
        
        // Create the ACK packet
        const ack = Buffer.alloc(4)

        ack.writeUInt16BE(0x601, 0)
        ack.writeUInt16BE(4, 2)
        response.copy(ack, 4)
        
        console.log(`Writting ack: ${ack.toString("hex")}`)
        console.log(`Writting response: ${response.toString("hex")}`)
                
        connectionSocket.socket.write(ack)
        connectionSocket.socket.write(response)

        return null
    }

    if (packet instanceof NPSGetPersonaMapsPacket) {
        const user = new UserGameData()
        user.setUserInfo(packet.customerId, 1, "Molly", 42)
        console.log(`writing user: ${user.toString()}`)

        const lengthBuffer = Buffer.alloc(2)
        lengthBuffer.writeUInt16BE(1)

        const maxPersonaBuffer = Buffer.alloc(2)
        maxPersonaBuffer.writeUInt16BE(1)

        

        const response = writeNPSHeader(0x607, Buffer.concat([lengthBuffer, maxPersonaBuffer, user.serializePersona()]))
        console.log(`Writting response: ${response.toString("hex")}`)
        connectionSocket.socket.write(response)

        return null
    }

    connectionSocket.socket.end()

    return null

}
/**
 * 
 * @param {import("./helpers.js").TaggedSocket} connectionSocket 
 * @returns 
 */
function getUserSessionFromSocket(connectionSocket) {

    const {socket } = connectionSocket

    if ((socket instanceof Socket) !== true) {
        throw new Error(`We are trying to tag a connection without a valid socket`)
    }

    const {localPort} = socket

    if (typeof localPort === "undefined" || localPort === 8228) {
        return
    }

    const statusRepository = new StatusRepository();

    const user = statusRepository.getUserSession(connectionSocket.customerId);

    if (user === null) {
        throw new Error(`Unable to locate session for customer id "${connectionSocket.customerId}"`);
    }

    if (!user.isKeySet()) {
        throw new Error(`Reached handle packet but session key was not set for customer id ${user.customerId}`);
    }

    console.log(`Verified that user "${user.customerId}" has the session key set`);
    return user;
}

