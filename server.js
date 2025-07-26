import { TCPServer } from "./src/TCPServer.js"
import { HTTPServer } from "./src/HTTPServer.js"
import { ServerManager } from "./src/ServerManager.js"
import { UserRepository } from "./src/UserRepository.js"

export {}

async function main() {
    console.log('Hello, world!')
    const userRepository = new UserRepository()

    const serverManager = new ServerManager({
        userRepository
    })

    serverManager.addServer(new HTTPServer('0.0.0.0', 3000))
    serverManager.addServer(new TCPServer('0.0.0.0', 8226))

    serverManager.start()

    // setTimeout(serverManager.quit.bind(serverManager), 10000)
}

await main()