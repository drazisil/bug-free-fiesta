import {hashSync} from "bcrypt"

const passwordToHash = process.argv[2]

if (typeof passwordToHash === "undefined") {
    process.exitCode = -1
    console.error('no password provided')
} else {
    console.log(hashSync(passwordToHash, 5))
}