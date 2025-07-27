import { Cipheriv, Decipheriv, getCiphers, privateDecrypt } from "node:crypto";
import { readFileSync } from "node:fs";


export class KeyRepository {
    #privateKey;

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

}
/**
 * @type {Map<number, {customerId: number, encryptor: Cipheriv, decryptor: Decipheriv}>}
 */
const sessonEncryptors = new Map();

