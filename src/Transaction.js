// Used for verifying transactions.
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Use 40 character hashes to create signatures.
// const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");

class Transaction {
    /**
    * @param {string} fromAddress
    * @param {string} toAddress
    * @param {int} amount
    */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = null;
    }

    /**
    * Creates a SHA256 hash of the transaction
    *
    * @returns {string}
    */
    calculateHash() {
        // return SHA256(this.fromAddress + 
        //     this.toAddress + 
        //     this.amount).toString();
        return crypto.createHash('sha256')
        .update(this.fromAddress + 
            this.toAddress + 
            this.amount + 
            this.timestamp).digest('hex');
    }

    /**
    * Signs a transaction with the given signingKey (which is an Elliptic keypair
    * object that contains a private key). The signature is then stored inside the
    * transaction object and later stored on the blockchain.
    *
    * @param {string} signingKey
    */
    signTransaction(signingKey) {
        // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
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

    /**
    * Checks if the signature is valid (transaction has not been tampered with).
    * It uses the fromAddress as the public key.
    *
    * @returns {boolean}
    */
    isValid() {
        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid.
        if(this.fromAddress === null) return true;

        // Needs to make sure person who is making the transaction
        // has signed it.
        if(!this.signature || this.signTransaction.length === 0) {
            throw new Error("No signature in this transaction");
        }

        // The public key from the person's address.
        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
        // Verify that the hash of this block has been signed by
        // the signature.
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports.Transaction = Transaction;