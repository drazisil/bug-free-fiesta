import { Cipheriv, createCipheriv, createDecipheriv, Decipheriv, getCiphers, privateDecrypt } from "node:crypto";
import { readFileSync } from "node:fs";


export class KeyRepository {
    #privateKey;
    #createSessionEncryptionSet

    /**
     *
     * @param {string} privateKeyPath
     */
    constructor(privateKeyPath) {


        const cipherList = getCiphers();
        if (!cipherList.includes("des-cbc") || !cipherList.includes("rc4")) {
            throw new Error("Legacy ciphers not available");
        }


        try {
            const privateKeyContents = readFileSync(privateKeyPath);
            this.#privateKey = privateKeyContents;
        } catch (e) {
            throw new Error(`Unable to initialize private key: ${e}`);
        }

        /**
         * 
         * @param {number} customerId 
         * @param {string} sessionKey 
         */
        this.#createSessionEncryptionSet = (customerId, sessionKey) => {
            const sKey = sessionKey.slice(0, 16);

            // Deepcode ignore HardcodedSecret: This uses an empty IV
            const desIV = Buffer.alloc(8);

            const npsEncryptor = createCipheriv("des-cbc", Buffer.from(sKey, "hex"), desIV);
            npsEncryptor.setAutoPadding(false);

            const npsDecryptor = createDecipheriv(
                "des-cbc",
                Buffer.from(sKey, "hex"),
                desIV,
            );
            npsDecryptor.setAutoPadding(false);


            const stringKey = Buffer.from(sessionKey, "hex");

            // File deepcode ignore InsecureCipher: RC4 is the encryption algorithum used here, file deepcode ignore HardcodedSecret: A blank IV is used here
            const mcotsEncryptor = createCipheriv("rc4", stringKey.subarray(0, 16), "");
            const mcotsDecryptor = createDecipheriv("rc4", stringKey.subarray(0, 16), "");

            sessonEncryptors.set(customerId, {
                customerId,
                npsEncryptor,
                npsDecryptor,
                mcotsEncryptor,
                mcotsDecryptor
            })

            console.log(`Session encryption set for ${customerId} saved`)

        }

    }


    /**
     *
     * @param {number} customerId
     * @param {Buffer} encryptedKey
     */
    parseKey(customerId, encryptedKey) {

        // Extract the session key which is 128 acsii characters (256 bytes)
        const sessionKeyAsAscii = encryptedKey.toString("utf8");

        // length of the session key should be 128 bytes
        const sessionkeyString = Buffer.from(sessionKeyAsAscii, "hex");
        // Decrypt the sessionkey
        const decrypted = privateDecrypt(
            {
                key: this.#privateKey
            },
            sessionkeyString
        ); // length of decrypted should be 128 bytes

        const sessionKeyLength = decrypted.readInt16BE(0);
        const sessionKey = decrypted.subarray(2, sessionKeyLength + 2).toString("hex");
        const expires = decrypted.readInt32BE(sessionKeyLength + 2);

        console.dir({ sessionKey, expires });
    }

    /**
     * 
     * @param {number} customerId 
     * @param {string} sessionKey 
     * @returns 
     */
    saveKey(customerId, sessionKey) { 

        return this.#createSessionEncryptionSet(customerId, sessionKey)

    }

}

/**
 * @exports SessionEncryptionSet
 * @typedef SessionEncryptionSet
 * @property {number} customerId
 * @property {Cipheriv} npsEncryptor
 * @property {Decipheriv} npsDecryptor
 * @property {Cipheriv} mcotsEncryptor
 * @property {Decipheriv} mcotsDecryptor
 */

/**
 * @type {Map<number, SessionEncryptionSet>}
 */
const sessonEncryptors = new Map();

