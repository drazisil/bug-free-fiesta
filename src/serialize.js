import { NPSUserLoginPacket } from "./NPSUserLoginPacket.js";
import { Packet } from "./Packet.js";

/**
 * @type {Map<number, (typeof Packet)>}
 */
const supportedCommands = new Map()
supportedCommands.set(0x501, NPSUserLoginPacket)

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
