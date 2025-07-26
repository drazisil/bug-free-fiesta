import { IncomingMessage, ServerResponse } from "node:http";
import { compareSync } from "bcrypt"
import { UserRepository } from "./UserRepository.js";
import { StatusRepository } from "./StatusRepository.js";
import { sendResponse } from "./helpers.js";

/**
 * 
 * @param {string} sessionId 
 */
function validAuth(sessionId) {
    return `Valid=TRUE\nTicket=${sessionId}`;
}

/**
 * 
 * @param {string} code 
 * @param {string} reason 
 * @param {string} url 
 */
function invalidAuth(code, reason, url) {
    return `reasoncode=${code}\nreasontext=${reason}\nreasonurl=${url}`;
}

/**
 *
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 */
export function routeAuthLogin(request, response) {

    const { url } = request

    if (typeof url === "undefined") {
        throw new Error('url is not defined')
    }

    const requestURL = new URL(url, "http://rusty-motors.com")

    const userName = requestURL.searchParams.get("username")
    const password = requestURL.searchParams.get("password")

    if (userName === null) {
        console.log('no username in request')
        return sendResponse(response, 400, invalidAuth("INV-199", "Because", "https://web.archive.org/web/20011006091249/http://www.motorcityonline.com:80/error/inv-199.html"))

    }

    if (password === null) {
        console.log('no password in request')
        return sendResponse(response, 400, invalidAuth("INV-199", "Because", "https://web.archive.org/web/20011006091249/http://www.motorcityonline.com:80/error/inv-199.html"))

    }

    const userRepository = new UserRepository()

    const user = userRepository.findByUsername(userName)

    if (user === null) {
        console.log(`User "${userName}" was not found`)
        return sendResponse(response, 400, invalidAuth("INV-199", "Because", "https://web.archive.org/web/20011006091249/http://www.motorcityonline.com:80/error/inv-199.html"))

    }

    const passwordIsValid = compareSync(password, user.passwordHash)

    if (!passwordIsValid) {
        console.log(`password for user "${userName}" did not match`)
        return sendResponse(response, 400, invalidAuth("INV-199", "Because", "https://web.archive.org/web/20011006091249/http://www.motorcityonline.com:80/error/inv-199.html"))

    }

    const statusRepository = new StatusRepository()

    const sessionToken = statusRepository.createSession(user.customerId)

    if (typeof sessionToken !== "undefined") {
        console.log(`user "${userName}" successfully logged in`)
        return sendResponse(response, 200, validAuth(sessionToken))
    }


    response.statusCode = 400
    response.setHeader("content-type", "text/plain")
    sendResponse(response, 400, invalidAuth("INV-199", "Because", "https://web.archive.org/web/20011006091249/http://www.motorcityonline.com:80/error/inv-199.html"))
}
