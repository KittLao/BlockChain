
// EC helps us generate a public and private key
// can sign something and verify a signature
const EC = require("elliptic").ec;

// secp256k1 is our elliptic curve. This is the algorithm
// that is the basis on bitcoin wallet
const ec = new EC("secp256k1");

const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

// Print the keys to the console
console.log();
console.log('Your public key (also your wallet address, freely shareable)\n', publicKey);

console.log();
console.log('Your private key (keep this secret! To sign transactions)\n', privateKey);
