const { BlockChain } = require("./BlockChain");
const { Transaction } = require("./Transaction");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

// Declare my walley using a private key.
const myKey = ec.keyFromPrivate("04de2b0ffe90eb1db4e3f196d462580e209a54a3693b88ef6d886a484641253a6cb14e8db5de63af1983e7014bfab1d272f46c65862fb2596ec2c8d50cf255e7cd");
const myWalletAddress = myKey.getPublic("hex");


// BlockChain and a transaction using my wallet.
let KitCoin = new BlockChain();

// Mine the genesis block to get ez 100 rewards.
KitCoin.minePendingTransactions(myWalletAddress);
console.log("Balance: " + KitCoin.getBalanceOfAddress(myWalletAddress));

// Spend some rewards
const tx1 = new Transaction(myWalletAddress, "public key goes here", 50);
tx1.signTransaction(myKey);
KitCoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress, "public key goes here", 60);
tx2.signTransaction(myKey);
KitCoin.addTransaction(tx2);

// Mine again
console.log("\nStarting the miner...");
KitCoin.minePendingTransactions(myWalletAddress);
console.log("Balance: " + KitCoin.getBalanceOfAddress(myWalletAddress));

