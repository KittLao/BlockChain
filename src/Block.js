// const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");

class Block {
    /**
    * @param {int} timestamp
    * @param {Transaction[]} transactions
    * @param {string} previousHash
    */
    constructor(timestamp, transactions, previousHash="") {
        // Real time date of when block was created.
        this.timestamp = timestamp;
        // List of transactions made.
        this.transactions = transactions;
        // Adds "chain" like feature by connecting the current block
        // to the previous block by storing the previous block's hash.
        this.previousHash = previousHash;
        // Block's hash.
        this.hash = this.calculateHash();
        // Doesn't really do anything except indicated how much computation
        // power required to mine a block.
        this.nonce = 0;
    }

    /**
    * Returns the SHA256 of this block (by processing all the data stored
    * inside this block)
    *
    * @returns {string}
    */
    calculateHash() {
        // return SHA256(this.previousHash + 
        //     this.timestamp + 
        //     JSON.stringify(this.transactions) + 
        //     this.nonce).toString();
        return crypto.createHash('sha256')
        .update(this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.transactions) + 
            this.nonce).digest('hex');
    }

    /**
    * Difficulty is the amount of searches a block has to make inorder for
    * the hash to begin with a certain amount of 0's. Higher difficulty 
    * will lead to exponential amount of searches.
    *
    * @param {number} difficulty
    */
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    /**
    * Validates all the transactions inside this block (signature + hash) and
    * returns true if everything checks out. False if the block is invalid.
    * Transactions are vald if they have been signed.
    * 
    * @returns {boolean}
    */
    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()) return false;
        }
        return true;
    }
}

module.exports.Block = Block;