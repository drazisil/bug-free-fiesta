import { readNPSHeader } from "./helpers.js";
import { Packet } from "./Packet.js";


/**
 * @implements {Packet}
*/
export class NPSLoginPacket {
    
    /**
     * 
     * @param {Buffer} data 
     */
    static Matches(data) {
        return data.readUInt16BE(0) === 0x100
    }
    
    get packetName() {
        return 'NPS_LOGIN'
    }
    
    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {

        
        const {headerSize,  messageLength, body} = readNPSHeader(data)

        const neededLength = messageLength - headerSize

        if (body.length < neededLength) {
            throw new Error(`not enough data. need ${neededLength} bytes, got ${body.length} bytes`)
        }

        // past code is ss
        
        // 0100
        // 008c
        
        // pack code is lpb

        // 00000001 // userId
        // 00000006 4d6f6c6c7900 //username
        // 0000000000000000000000000000000000000000000000000000000000000000 // user data
        // 0000000000000000000000000000000000000000000000000000000000000000
        
        // pack code is llpppb
        
        // 0000007b // customerid
        // 00000000 // server flags
        // 00000008 342e352e302e3000 // version
        // 00000004 6d636f00 // hostname
        // 0000000a 31302e31302e352e3800  ip address
        // f0d87a8c09af774f048d34192725088f // sesson key hash

    }

    /**
     * @returns {Buffer}
     */
    serialize() {
        throw new Error('not implemented: inbound packet only')
    }

    /**
     * 
     * @param {Buffer} data 
     */
    static Parse(data) {
        const self = new NPSLoginPacket()
        self.deserialize(data)
        return self
    }
}