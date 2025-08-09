import { ensureSufficientData, getNextPrefixedValue, readNPSHeader } from "./helpers.js";
import { Packet } from "./Packet.js";

export class NPSUserInfo {
    #personaId
    #personaName
    #userData

    constructor() {
        this.#personaId = 0
        this.#personaName = ""
        this.#userData = Buffer.alloc(64)
    }

    /**
     * 
     * @param {Buffer} data 
     * @returns {Buffer}
     */
    deserialize(data) {

        let remainingData = data
        let r

        ensureSufficientData(remainingData, 4, 'userId')

        this.#personaId = remainingData.readUInt32BE()
        remainingData = remainingData.subarray(4)

        r = getNextPrefixedValue(remainingData, 4)

        remainingData = r.remainingBody

        this.#personaName = r.value.toString("utf8")

        this.#userData = Buffer.from(remainingData.subarray(0, 64))

        return Buffer.from(remainingData.subarray(64))

    }

    get personaId() {
        return this.#personaId
    }

    get personaName() {
        return this.#personaName
    }
}

/**
 * @implements {Packet}
*/
export class NPSLoginPacket {
    #userInfo
    #customerId
    #serverFlags
    #clientVersion
    #clientHostname
    #clientIp
    #sessionKeyHash

    constructor() {
        this.#userInfo = new NPSUserInfo()
        this.#customerId = 0
        this.#serverFlags = 0
        this.#clientVersion = ""
        this.#clientHostname = ""
        this.#clientIp = ""
        this.#sessionKeyHash = ""
    }
    
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

        let r
        let remainingData
        
        const {headerSize,  messageLength, body} = readNPSHeader(data)

        const neededLength = messageLength - headerSize

        ensureSufficientData(body, neededLength, 'message');

        // pack code is ss

        remainingData = body

        // pack code is lpb

        remainingData = this.#userInfo.deserialize(remainingData)

        // pack code is llpppb

        ensureSufficientData(remainingData, 4,'customerId' )

        this.#customerId = remainingData.readUInt32BE()

        remainingData = remainingData.subarray(4)

        ensureSufficientData(remainingData, 4, 'serverFlags')

        this.#serverFlags = remainingData.readUInt32BE()

        remainingData = remainingData.subarray(4)

        r = getNextPrefixedValue(remainingData, 4)

        this.#clientVersion = r.value.toString("utf8")

        remainingData = r.remainingBody

        r = getNextPrefixedValue(remainingData, 4)

        this.#clientHostname = r.value.toString("utf8")

        remainingData = r.remainingBody

        r = getNextPrefixedValue(remainingData, 4)
        
        this.#clientIp = r.value.toString("utf8")

        remainingData = r.remainingBody

        ensureSufficientData(remainingData, 16, 'sessionKeyHash')

        this.#sessionKeyHash = remainingData.subarray(0, 16).toString("utf8")
        
        // 0000007b // customerid
        // 00000000 // server flags
        // 00000008 342e352e302e3000 // version
        // 00000004 6d636f00 // hostname
        // 0000000a 31302e31302e352e3800  ip address
        // f0d87a8c09af774f048d34192725088f // sesson key hash

        console.log(`CustomerId ${this.#customerId}`)

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

    get personaId() {
        return this.#userInfo.personaId
    }

    get personaName() {
        return this.#userInfo.personaName
    }

    get customerId() {
        return this.#customerId
    }
}


