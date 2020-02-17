const Block = require('./block');
const { cryptoHash } = require('../util');
const { REWARD_INPUT , MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }

    replaceChain(incomingChain, onSuccess){
        if(incomingChain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(incomingChain)){
            console.error('The incoming chain must be valid');
            return;
        }

        if(onSuccess){
            onSuccess();
        }

        console.log("replacing chain with",incomingChain);
        this.chain = incomingChain;
    }

    validTransactionData({chain}){
        for(let i = 1 ; i < chain.length ; i++){
            const block = chain[i];
            let rewardTransactionCount = 0;

            for(let transaction of block.data){
                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount ++;

                    if(rewardTransactionCount > 1){
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error("Invalid miner reward amount");
                        return false;
                    }
                }else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error("invalid transaction");
                        return false;
                    }
                }
            }
        }
        return true;

    }

    static isValidChain(chain){
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for(let i = 1 ; i < chain.length ; i++){
            const currentBlock = chain[i];
            const {timestamp,data,lastHash , hash,nonce,difficulty} = currentBlock;
            const shouldBeLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if(Math.abs(lastDifficulty - difficulty ) > 1) return false;

            if(lastHash !== shouldBeLastHash) return false;

            const hashValue = cryptoHash(timestamp,data,lastHash,nonce,difficulty)

            if(hashValue !== hash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;
