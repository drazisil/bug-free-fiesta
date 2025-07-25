import { createServer, Socket } from "net"

export {}

/**
 * @interface ServerInstance
 */
class ServerInstance {
    /**
     * @abstract
     * @param {string} address 
     * @param {number} port 
     */
    constructor(address, port) {
        throw new Error('method muxt be implemented in subclass')
    }

    /**
     * @abstract
     * @param {Socket} socket 
     */
    acceptConnection(socket) {
        throw new Error('method must be implimated in subclass')
    }

    /**
     * @abstract
     * @param {Buffer} data 
     */
    handleData(data) {
        throw new Error('method must be implemented in subclass')
    }

    /**
     * @abstract
     */
    start() {
        throw new Error('method must be implemeted in subclass')
    }

    /**
     * @abstract
     */
    async stop() {
        throw new Error('method must be implemented in subclass')
    }

    /**
     * @abstract
     * @returns {boolean}
     */
    isListening() {
        throw new Error('method must be implemeted in subclass')
    }

    /**
     * @abstract
     * @returns {string}
     */
    get address() {
        throw new Error('method must be implemented on subclass')
    }

    /**
     * @abstract
     * @returns {number}
     */
    get port() {
        throw new Error('method must be implemented on subclass')
    }
}

/**
 * @implements {ServerInstance}
 */
class TCPServer {
    #server
    #listeningAddress
    #listeningPort
    #isListening

    /**
     * 
     * @param {string} address 
     * @param {number} port 
     */
    constructor(address, port) {
        this.#listeningAddress = address
        this.#listeningPort = port
        this.#isListening = false
        this.#server = createServer(this.acceptConnection.bind(this))        
    }

    /**
     * 
     * @param {Socket} socket 
     */
    acceptConnection(socket) {
        const { remoteAddress, localPort } = socket
        if (typeof remoteAddress === "undefined") {
            throw new Error('remote address is missing on socket')
        }

        if (typeof localPort === "undefined") {
            throw new Error('local port missing on socket')
        }

        console.log(`New connection from ${remoteAddress} to port ${localPort}`)
        const self = this
        socket.on("data", self.handleData)

    }

    /**
     * 
     * @param {Buffer} data 
     */
    handleData(data) {
        console.log(`Recieved data: ${data.toString("hex")}`)
    }

    /**
     * 
     */
    start() {
        this.#server.listen(this.#listeningPort, this.#listeningAddress)
        console.log(`Server listening on ${this.#listeningAddress}:${this.#listeningPort}`)
        this.#isListening = true
    }

    async stop() {
        /**
         * @returns {Promise<void>}
         */
        return new Promise((resolve, reject) => {
            this.#server.close(() => {
                console.log(`Server no longer listening on ${this.#listeningAddress}:${this.#listeningPort}`)
                this.#isListening = false
                resolve(undefined)
            })
            // Force server to exit if needed
            setTimeout(() => {
                console.log('Server did not exit in a timely manner, focing closed')
                this.#server.emit("close")}, 5000)
        })
    }

    /**
     * 
     * @returns {boolean}
     */
    isListening() {
        return this.#isListening
    }

    /**
     * @returns {string}
     */
    get address() {
        return this.#listeningAddress
    }

    /**
     * @returns {number}
     */
    get port() {
        return this.#listeningPort
    }
}

class ServerManager {
    #isRunning
    #isQuiting
    #doLoop
    #timerInterval
    /**
     * @type {ServerInstance[]}
     */
    #servers

    constructor() {
        this.#servers = []
        this.#isQuiting = false
        this.#isRunning = false
        this.#timerInterval = 3000

        this.#doLoop = () => {

            if (this.#isQuiting) {
                return
            }

            if (this.#isRunning) {
                console.log('Loop')
            }

            setTimeout(this.#doLoop.bind(this), this.#timerInterval)

        }


    }

    start() {
        for (const server of this.#servers) {
            server.start()
        }

        this.#isRunning = true
        this.#doLoop()
    }

    async stop() {
        for (const server of this.#servers) {
            await server.stop()
        }
        this.#isRunning = false
        console.log('All servers stopped')
    }

    async quit() {
        await this.stop()
        this.#isQuiting = true
    }

    /**
     * 
     * @param {ServerInstance} server 
     */
    addServer(server) {
        this.#servers.push(server)
        console.log(`Added server listening to ${server.address}:${server.port}`)
    }
}

async function main() {
    console.log('Hello, world!')
    const serverManager = new ServerManager()

    serverManager.addServer(new TCPServer('0.0.0.0', 3000))

    serverManager.start()

    setTimeout(serverManager.quit.bind(serverManager), 10000)
}

await main()