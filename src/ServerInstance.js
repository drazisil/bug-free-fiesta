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
        throw new Error('method muxt be implemented in subclass');
    }

    /**
     * @abstract
     * @param {Socket} socket
     */
    acceptConnection(socket) {
        throw new Error('method must be implimated in subclass');
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
}
