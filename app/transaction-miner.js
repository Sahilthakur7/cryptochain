class TransactionMiner {
    constructor({blockchain,transactionPool,wallet,pubsub}){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet ;
        this.pubsub = pubsub;

    }

    mineTransaction(){
        //Get valid transactions from the pool
        //Generate the miner's reward
        //add a block consisting of these transactions to the blockchain
        //broadcast the updated blockchain
        //clear the transaction pool
    };
};

module.exports = TransactionMiner;

