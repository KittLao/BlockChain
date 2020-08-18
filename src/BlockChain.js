const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class BlockChain {
    constructor() {
        // The actual blockchain
        this.chain = [this.createGenesisBlock()];
        // Time needed to mine a block. Increases exponentially.
        this.difficulty = 3;
        // Transactions needed to be processed inorder to mine
        // a block.
        this.pendingTransactions = [];
        // Reward earned for mining a block.
        this.miningReward = 100;
    }

    // Genesis is the initial block. There is not previous hash
    // for it, no acutal data, and index is at 0. The date is my
    // birthday.
    /* :Block: */
    createGenesisBlock() {
        return new Block("06/30/1997", "Genesis block", "0");
    }

    /* :Block: */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // When called, a wallet will be passed in. This will process
    // all the transactions 
    /* :key: */
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined.");
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    addTransaction(transaction) {
        // Make sure there is a valid address for person
        // making the transaction and person recieving
        // the transaction.
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to address.");
        }
        // Verify transaction being added is valid
        if(!transaction.isValid()){
            throw new Error("Transaction must be valid.");
        }
        this.pendingTransactions.push(transaction);
    }

    getBlanceOfAddress(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // All transactions in current block needs to
            // be correct.
            if(!curBlock.hasValidTransactions()) return false;

            // Actual hash of block doesn't match up.
            if(curBlock.hash !== curBlock.calculateHash()) {
                return false;
            }
            // Chain invalid
            if(curBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.BlockChain = BlockChain;