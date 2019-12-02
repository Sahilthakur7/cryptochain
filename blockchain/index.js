const Block = require('./block');
const { cryptoHash } = require('../util');

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

    replaceChain(incomingChain){
        if(incomingChain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }

        if(!Blockchain.isValidChain(incomingChain)){
            console.error('The incoming chain must be valid');
            return;
        }

        console.log("replacing chain with",incomingChain);
        this.chain = incomingChain;
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
