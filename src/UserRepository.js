/**
 * @typedef User
 * @property {number} customerId
 * @property {string} username
 * @property {string} passwordHash
*/


/**
 * @type { Map<number, User>}
 */
const users = new Map();

export class UserRepository {
    constructor() { }

    /**
     *
     * @param {string} username
     * @param {string} passwordHash
     * @returns {User}
     */
    newUser(username, passwordHash) {
        return {
            customerId: 0,
            username,
            passwordHash
        };
    }

    /**
     *
     * @param {string} username
     * @returns {User | null}
     */
    findByUsername(username) {
        for (const user of users.values()) {
            if (user.username === username) {
                return user
            }
        }
        return null
    }

    /**
     *
     * @param {number} customerId
     * @return {User | null}
     */
    getUserById(customerId) {
        return users.get(customerId) ?? null
    }

    /**
     *
     * @param {User} user
     */
    saveUser(user) {
        users.set(user.customerId, user)
     }
}

