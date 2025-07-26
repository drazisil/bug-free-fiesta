import { createServer as createTCPServer, Socket } from "node:net";

/**
 * @implements {ServerInstance}
 */
export class TCPServer {
    #server;
    #listeningAddress;
    #listeningPort;
    #isListening;

    /**
     *
     * @param {string} address
     * @param {number} port
     */
    constructor(address, port) {
        this.#listeningAddress = address;
        this.#listeningPort = port;
        this.#isListening = false;
        this.#server = createTCPServer(this.acceptConnection.bind(this));
    }

    /**
     *
     * @param {Socket} socket
     */
    acceptConnection(socket) {
        const { remoteAddress, localPort } = socket;
        if (typeof remoteAddress === "undefined") {
            throw new Error('remote address is missing on socket');
        }

        if (typeof localPort === "undefined") {
            throw new Error('local port missing on socket');
        }

        console.log(`New connection from ${remoteAddress} to port ${localPort}`);
        const self = this;
        socket.on("data", self.handleData);

    }

    /**
     *
     * @param {Buffer} data
     */
    handleData(data) {
        console.log(`Recieved data: ${data.toString("hex")}`);
    }

    /**
     *
     */
    start() {
        this.#server.listen(this.#listeningPort, this.#listeningAddress);
        console.log(`Server listening on ${this.#listeningAddress}:${this.#listeningPort}`);
        this.#isListening = true;
    }

    async stop() {
        /**
         * @returns {Promise<void>}
         */
        return new Promise((resolve, reject) => {
            this.#server.close(() => {
                console.log(`Server no longer listening on ${this.#listeningAddress}:${this.#listeningPort}`);
                this.#isListening = false;
                resolve(undefined);
            });
            // Force server to exit if needed
            setTimeout(() => {
                console.log('Server did not exit in a timely manner, focing closed');
                this.#server.emit("close");
            }, 5000);
        });
    }

    /**
     *
     * @returns {boolean}
     */
    isListening() {
        return this.#isListening;
    }

    /**
     * @returns {string}
     */
    get address() {
        return this.#listeningAddress;
    }

    /**
     * @returns {number}
     */
    get port() {
        return this.#listeningPort;
    }
}
