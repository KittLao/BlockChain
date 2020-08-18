const SHA256 = require("crypto-js/sha256");

class Block {
    // timestamp: when was it created
    // [Transaction]: Amount that was passed from one address to another.
    // previousHash: Each block has a hash associated with it. To create a 
    // "chain", each block must reference its previousHash.
    /* :string: -> :[Transaction]: -> :string: -> None */
    constructor(timestamp, transactions, previousHash="") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // Use the properties to create a new hash for the block
    calculateHash() {
        return SHA256(this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.transactions) + 
            this.nonce).toString();
    }

    // Difficulty is the amount of searches a block has to make inorder for
    // the hash to begin with a certain amount of 0's. Higher difficulty 
    // will lead to exponential amount of searches.
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }

    // Verify all transactions in current block
    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()) return false;
        }
        return true;
    }
}

module.exports.Block = Block;