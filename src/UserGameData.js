import { align4, writeNextPrefixedValue, writeShortBool } from "./helpers.js";
import { Packet } from "./Packet.js";

/**
 * @implements {Packet}
 */
export class UserGameData {
    /** @type {number} */
    #customerId
    #gameUsername
    #serverDataId
    #createDate
    #lastLogin
    #numGames
    #gameUserId
    #isOnSystem
    #purchaseDate
    #serialNumber
    #timeOnline
    #timeInGame
    #gameSpecificBlob
    #personalBlob
    #pictureBlob
    #dnd
    #gameStart
    #currentKey
    #personaLevel
    #shardId

    constructor() {
        this.#customerId = 0
        this.#gameUsername = ""
        this.#serverDataId = 0
        this.#createDate = 0
        this.#lastLogin = 0
        this.#numGames = 0
        this.#gameUserId = 0
        this.#isOnSystem = false
        this.#purchaseDate = 0
        this.#serialNumber = ""
        this.#timeOnline = 0
        this.#timeInGame = 0
        this.#gameSpecificBlob = Buffer.alloc(512)
        this.#personalBlob = Buffer.alloc(256)
        this.#pictureBlob = Buffer.alloc(1)
        this.#dnd = false
        this.#gameStart = 0
        this.#currentKey = ""
        this.#personaLevel = 1
        this.#shardId = 0
    }

    /**
     * 
     * @param {number} customerId 
     * @param {number} personaId 
     * @param {string} personaName 
     * @param {number} shardId 
     */
    setUserInfo(customerId, personaId, personaName, shardId) {
        this.#customerId = customerId
        this.#gameUserId = personaId
        this.#gameUsername = personaName
        this.#shardId = shardId
    }

    get size() {
        return 4 // customerId
            + align4(2 + this.#gameUsername.length)
            + 4 // serverDataId
            + 4 // createDate
            + 4 // lastLogin
            + 4 // numGames
            + 4 // gameUserId
            + align4(2) // isOnSystem
            + 4 // purchaseDate
            + align4(2 + this.#serialNumber.length)
            + 4 // timeOnline
            + 4 // timeInGame
            + align4(2 + this.#gameSpecificBlob.length)
            + align4(2 + this.#personalBlob.length)
            + align4(2 + this.#pictureBlob.length)
            + align4(2) // dnd
            + 4 // gameStart
            + align4(2 + this.#currentKey.length)
            + align4(2) // personaLevel
            + 4 // shardId
    }

    get sizeOfPersona() {
                return 4 // customerId
                + 4 // gameUserId
                + 4 // shardId
                + 4 // createDate
                + 2 + this.#gameUsername.length
    }

    get packetName() {
        return 'UserGameData'
    }

    /**
     * 
     * @param {Buffer} data 
     */
    deserialize(data) {
        throw new Error('Not yet implemented')
    }

    /**
     * @returns {Buffer}
     */
    serialize() {

        const neededSize = this.size
        let buffer = Buffer.alloc(neededSize)

        let offset = 0
        let r

        buffer.writeUInt32BE(this.#customerId, offset)
        offset += 4
        r = writeNextPrefixedValue(buffer, Buffer.from(this.#gameUsername, 'utf8'), offset)
        offset = align4(r.nextOffset)
        r.buffer.writeUInt32BE(this.#serverDataId, offset)
        offset += 4
        r.buffer.writeUInt32BE(this.#createDate, offset)
        offset += 4
        r.buffer.writeUInt32BE(this.#lastLogin, offset)
        offset += 4
        r.buffer.writeUInt32BE(this.#numGames, offset)
        offset += 4
        r.buffer.writeUInt32BE(this.#gameUserId, offset)
        offset += 4
        r = writeShortBool(r.buffer, this.#isOnSystem, offset)
        offset = align4(r.nextOffset)
        r.buffer.writeUInt32BE(this.#purchaseDate, offset)
        offset += 4
        r = writeNextPrefixedValue(r.buffer, Buffer.from(this.#serialNumber, "utf8"), offset)
        offset = align4(r.nextOffset)
        r.buffer.writeUInt32BE(this.#timeOnline, offset)
        offset += 4
        r.buffer.writeUInt32BE(this.#timeInGame, offset)
        offset += 4
        r = writeNextPrefixedValue(r.buffer, this.#gameSpecificBlob, offset)
        offset = align4(r.nextOffset)
        r = writeNextPrefixedValue(r.buffer, this.#personalBlob, offset)
        offset = align4(r.nextOffset)
        r = writeNextPrefixedValue(r.buffer, this.#pictureBlob, offset)
        offset = align4(r.nextOffset)
        r = writeShortBool(r.buffer, this.#dnd, offset)
        offset = align4(r.nextOffset)
        r.buffer.writeUInt32BE(this.#gameStart, offset)
        offset += 4
        r = writeNextPrefixedValue(r.buffer, Buffer.from(this.#currentKey, "utf8"), offset)
        offset = align4(r.nextOffset)
        r.buffer.writeUInt16BE(this.#personaLevel, offset)
        offset = align4(offset + 2)
        r.buffer.writeUInt32BE(this.#shardId, offset)




        return buffer

    }

    /**
     * @returns {Buffer}
     */
    serializePersona() {

        const neededSize = this.sizeOfPersona
        let buffer = Buffer.alloc(neededSize)

        let offset = 0
        let r

        buffer.writeUInt32BE(this.#customerId, offset)
        offset += 4
        buffer.writeUInt32BE(this.#gameUserId, offset)
        offset += 4
        buffer.writeUInt32BE(this.#shardId, offset)
        offset += 4
        buffer.writeUInt32BE(this.#createDate, offset)
        offset += 4
        r = writeNextPrefixedValue(buffer, Buffer.from(this.#gameUsername, 'utf8'), offset)




        return buffer

    }

    /**
 * @returns {string}
 */
    toString() {
        return `UserGameData {
  customerId: ${this.#customerId},
  gameUsername: "${this.#gameUsername}",
  serverDataId: ${this.#serverDataId},
  createDate: ${this.#createDate},
  lastLogin: ${this.#lastLogin},
  numGames: ${this.#numGames},
  gameUserId: ${this.#gameUserId},
  isOnSystem: ${this.#isOnSystem},
  purchaseDate: ${this.#purchaseDate},
  serialNumber: "${this.#serialNumber}",
  timeOnline: ${this.#timeOnline},
  timeInGame: ${this.#timeInGame},
  gameSpecificBlob: Buffer(${this.#gameSpecificBlob.length} bytes),
  personalBlob: Buffer(${this.#personalBlob.length} bytes),
  pictureBlob: Buffer(${this.#pictureBlob.length} bytes),
  dnd: ${this.#dnd},
  gameStart: ${this.#gameStart},
  currentKey: "${this.#currentKey}",
  personaLevel: ${this.#personaLevel},
  shardId: ${this.#shardId}
}`
    }
}
