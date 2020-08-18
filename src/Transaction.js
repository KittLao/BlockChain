// Used for verifying transactions.
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Used for creating hashes for creating signatures.
const SHA256 = require("crypto-js/sha256");

class Transaction {
    // :publicKey: -> :publicKey: -> :double:
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = null;
    }

    calculateHash() {
        return SHA256(this.fromAddress + 
            this.toAddress + 
            this.amount).toString();
    }

    signTransaction(signingKey) {
        // Since publicKey is linked o to the private key, 
        // the fromAddress needs to equal the publicKey.
        if(signingKey.getPublic("hex") !== this.fromAddress) {
            throw new Error("You cannoy sign transactions for other wallets");
        }
        // Hash for the transaction.
        const hashTx = this.calculateHash();
        // Use hash to create signature.
        const sig = signingKey.sign(hashTx, "base64");
        // Sign the transaction by declaring the signature.
        this.signature = sig.toDER("hex");
    }

    // Verifies transaction is correct
    isValid() {
        // If transaction was the intial transaction (so like
        // amount obtained from mining rewards), automatically
        // valid.
        if(this.fromAddress === null) return true;

        // Needs to make sure person who is making the transaction
        // signs it.
        if(!this.signature || this.signTransaction.length === 0) {
            throw new Error("No signature in this transaction");
        }

        // Verify signature was signed by correct key from person
        // making the transaction. 
        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
        // Verify that the hash of this block has been signed by
        // the signature
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;