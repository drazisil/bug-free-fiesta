import { ServerInstance } from "./ServerInstance.js";
import { UserRepository } from "./UserRepository.js";

export class ServerManager {
    /**
     * @type {UserRepository | null}
     */
    #userRepositoty
    /**
     * @type {ServerInstance[]}
     */
    #servers;
    #isQuiting;
    #isRunning;
    #timerInterval;
    #doLoop;

    /**
     * 
     * @param {object} param0 
     * @param {UserRepository | undefined} param0.userRepository
     */
    constructor({
        userRepository = undefined
    }) {
        this.#userRepositoty = userRepository ?? null
        this.#servers = [];
        this.#isQuiting = false;
        this.#isRunning = false;
        this.#timerInterval = 3000;

        this.#doLoop = () => {

            if (this.#isQuiting) {
                return;
            }

            if (this.#isRunning) {
                // console.log('Loop')
            }

            setTimeout(this.#doLoop.bind(this), this.#timerInterval);

        };


    }

    start() {
        for (const server of this.#servers) {
            server.start();
        }

        this.#isRunning = true;
        this.#doLoop();
    }

    async stop() {
        for (const server of this.#servers) {
            await server.stop();
        }
        this.#isRunning = false;
        console.log('All servers stopped');
    }

    async quit() {
        await this.stop();
        this.#isQuiting = true;
    }

    /**
     *
     * @param {ServerInstance} server
     */
    addServer(server) {
        this.#servers.push(server);
        console.log(`Added server listening to ${server.address}:${server.port}`);
    }
}
