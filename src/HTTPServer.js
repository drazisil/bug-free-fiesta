import { createServer as createHTTPServer, IncomingMessage, ServerResponse } from "node:http";
import { Socket } from "node:net";
import { ServerInstance } from "./ServerInstance.js";
import { webRoutes } from "./webRoutes.js";

/**
 * @implements {ServerInstance}
 */
export class HTTPServer {
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
        this.#server = createHTTPServer(this.handleHTTPRequest.bind(this));
    }

    /**
     *
     * @param {Socket} socket
     */
    acceptConnection(socket) {
        throw new Error('method not used');

    }

    /**
     *
     * @param {IncomingMessage} request
     * @param {ServerResponse} response
     */
    handleHTTPRequest(request, response) {
        const { method, url, socket, headers } = request;

        if (typeof method === "undefined") {
            throw new Error('method is undefined');
        }

        if (typeof url === "undefined") {
            throw new Error('url is undefined');
        }

        const { remoteAddress, localPort } = socket;

        if (typeof remoteAddress === "undefined") {
            throw new Error('remote address is undefined');
        }

        if (typeof localPort === "undefined") {
            throw new Error('local port is undefined');
        }

        const originalClientIp = headers['x-forwarded-for'];

        console.log(`Request for "${method} ${url}" from ${originalClientIp ? originalClientIp : remoteAddress} on port ${localPort}`);

        for (const route of webRoutes) {
            if (route.pathMatches(url)) {
                route.routeHandler(request, response)
                return
            }
        }
        response.statusCode = 404
        response.end("Not found")
    }

    /**
     *
     * @param {Buffer} data
     */
    handleData(data) {
        throw new Error('method not used');
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
