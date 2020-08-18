
// EC helps us generate a public and private key
// can sign something and verify a signature
const EC = require("elliptic").ec;

// secp256k1 is our elliptic curve. This is the algorithm
// that is the basis on bitcoin wallet
const ec = new EC("secp256k1");

const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log("Private key: " + privateKey);
console.log("Public key: " + publicKey);
