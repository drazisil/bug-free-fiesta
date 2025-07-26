import { Socket } from "node:net";

export class ShardInstance {
    #shardId
    #shardName
    #shardDescription
    #shardHost
    /**
     * @type {"online" | "offline"}
     */
    #shardStatus

    /**
     * 
     * @param {number} shardId 
     * @param {string} name 
     * @param {string} description 
     * @param {string} host 
     */
    constructor(shardId, name, description, host) {
        this.#shardId = shardId
        this.#shardName = name
        this.#shardDescription = description
        this.#shardHost = host
        this.#shardStatus = "offline"        
    }

    /**
     * @abstract
     * @param {Socket} socket
     */
    acceptConnection(socket) {
        
        const {remoteAddress, localPort} = socket

        if (typeof remoteAddress === "undefined") {
            throw new Error('remote address is undefined')
        }

        if (typeof localPort === "undefined") {
            throw new Error('local port is undefined')
        }

        console.log(`New connection to shard "${this.#shardName}" on port "${localPort}" from "${remoteAddress}"`)
    }

    /**
     * @abstract
     * @param {Buffer} data
     */
    handleData(data) {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     */
    start() {
        throw new Error('method must be implemeted in subclass');
    }

    /**
     * @abstract
     */
    async stop() {
        throw new Error('method must be implemented in subclass');
    }

    /**
     * @abstract
     * @returns {boolean}
     */
    isListening() {
        throw new Error('method must be implemeted in subclass');
    }

    /**
     * @abstract
     * @returns {string}
     */
    get address() {
        throw new Error('method must be implemented on subclass');
    }

    /**
     * @abstract
     * @returns {number}
     */
    get port() {
        throw new Error('method must be implemented on subclass');
    }

    get name() {
        return this.#shardName
    }

    get description() {
        return this.#shardDescription
    }

    get id() {
        return this.#shardId
    }

    get host() {
        return this.#shardHost
    }

    get loginPort() {
        return 8226
    }

    get lobbyPort() {
        return 7003
    }

    get statusId() {
        return 0
    }

    get statusReason() {
        return ""
    }

    get serverGroup() {
        return "Group-1"
    }

    get population() {
        return 0
    }

    get maxPersonasAllowedPerUser() {
        return 1
    }
}
