import { createServer as createTCPServer, Socket } from "node:net";
import { ServerInstance } from "./ServerInstance.js";
import { getPacketSerializer } from "./serialize.js";
import { NPSUserLoginPacket } from "./NPSUserLoginPacket.js";
import { handlePacket } from "./handlePacket.js";
import { NPSLoginPacket } from "./NPSLoginPacket.js";

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
        socket.on("error", (err) => { console.log(err)})
        socket.on("data", (data) => { self.handleData(data, {customerId: -1, socket}) });

        if (localPort === 7003) {
            console.log('sending ok to login packet')
            socket.write(Buffer.from([0x02, 0x30, 0x00, 0x04]))
        }

    }

    /**
     *
     * @param {Buffer} data
     * @param {import("./helpers.js").TaggedSocket | null} socket 
     */
    handleData(data, socket = null) {
        console.log(`Recieved data: ${data.toString("hex")}`);

        if (socket === null) {
            throw new Error('Socket is null!')
        }

        const packetserializer = getPacketSerializer(data)

        if (packetserializer === null) {
            console.log(`unable to locate matching packet serializer`)
            return
        }

        const packet = packetserializer.Parse(data)

        console.log(`Identified packet as ${packet.packetName}`)

        if (packet instanceof NPSUserLoginPacket) {
            socket.customerId = packet.customerId
        }

        if (packet instanceof NPSLoginPacket) {
            socket.customerId = packet.customerId
        }

        // Route packet
        handlePacket(packet, socket)
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
