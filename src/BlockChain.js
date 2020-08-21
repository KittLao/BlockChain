const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class BlockChain {
    constructor() {
        // The actual blockchain.
        this.chain = [this.createGenesisBlock()];
        // Time and cpu needed to mine a block. Increases exponentially.
        this.difficulty = 3;
        // Transactions needed to be processed inorder to mine a block.
        this.pendingTransactions = [];
        // Reward earned for mining a block.
        this.miningReward = 100;
    }

    /**
    * Genesis is the initial block. Date is my birthday, 
    * there no transactions and no previous hash.
    * 
    * @returns {Block}
    */
    createGenesisBlock() {
        return new Block(Date.parse("1997-06-30"), [], "0");
    }

    /**
    * Returns the latest block on our chain. Useful when you want to create a
    * new Block and you need the hash of the previous Block.
    *
    * @returns {Block[]}
    */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
    * Takes all the pending transactions, puts them in a Block and starts the
    * mining process. It also adds a transaction to send the mining reward to
    * the given address.
    *
    * @param {string} miningRewardAddress
    */
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined");
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    /**
    * Add a new transaction to the list of pending transactions (to be added
    * next time the mining process starts). This verifies that the given
    * transaction is properly signed.
    *
    * @param {Transaction} transaction
    */
    addTransaction(transaction) {
        // Make sure there is a valid address for person making the transaction 
        // and person recieving the transaction.
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("Transaction must include from and to address.");
        }
        // Verify transaction being added is valid
        if(!transaction.isValid()){
            throw new Error("Transaction must be valid.");
        }

        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }
          
        // // Making sure that the amount sent is not greater than existing balance
        // if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
        //     throw new Error('Not enough rewards in balance');
        // }

        this.pendingTransactions.push(transaction);
        console.log("Transaction successfully added.");
    }

    /**
    * Returns the balance of a given wallet address.
    *
    * @param {string} address
    * @returns {number} The balance of the wallet
    */
    getBalanceOfAddress(address) {
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

    /**
    * Returns a list of all transactions that happened
    * to and from the given wallet address.
    *
    * @param  {string} address
    * @return {Transaction[]}
    */
    getAllTransactionsFromWallet(address) {
        const txs = [];
        for(const block of this.chain) {
            for(const tx of block.transactions) {
                if(tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }
        return txs;
    }

    /**
    * Loops over all the blocks in the chain and verify if they are properly
    * linked together and nobody has tampered with the hashes. By checking
    * the blocks it also verifies the (signed) transactions inside of them.
    *
    * @returns {boolean}
    */
    isChainValid() {
        // Make sure genesis block hasn't been tampered with.
        const realGenesis = JSON.stringify(this.createGenesisBlock());
        if(realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // Check the remaining blocks on the chain to see if there
        // hashes and signatures are correct.
        for(let i = 1; i < this.chain.length; i++) {
            const curBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];

            // All transactions in current block needs to be correct.
            if(!curBlock.hasValidTransactions()) return false;
            // Actual hash of block doesn't match up.
            if(curBlock.hash !== curBlock.calculateHash()) return false;
            // Chain invalid
            if(curBlock.previousHash !== prevBlock.hash) return false;
        }
        return true;
    }
}

module.exports.BlockChain = BlockChain;