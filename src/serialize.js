import { NPSGetPersonaMapsPacket } from "./NPSGetPersonaMapsPacket.js";
import { NPSRegisterGameLoginPacket } from "./NPSRegisterGameLoginPacket.js";
import { NPSUserLoginPacket } from "./NPSUserLoginPacket.js";
import { Packet } from "./Packet.js";

/**
 * @type {Map<number, (typeof Packet)>}
 */
const supportedCommands = new Map()
supportedCommands.set(0x501, NPSUserLoginPacket)
supportedCommands.set(0x503, NPSRegisterGameLoginPacket)
supportedCommands.set(0x532, NPSGetPersonaMapsPacket)

/**
 * 
 * @param {Buffer} data 
 * @return {(typeof Packet) | null}
 */
export function getPacketSerializer(data) {

    /**
     * @type {(typeof Packet) | null}
     */
    let packet = null

    for (const command of supportedCommands.values()) {
        if (command.Matches(data)) {
            packet = command
            break
        }
    }

    return packet
}
