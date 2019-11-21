const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const cryptoHash = require('../util/crypto-hash');

class Block{
    constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static genesis(){
        const genesisBlock = new Block({...GENESIS_DATA})

        return genesisBlock;
    }

    static mineBlock({lastBlock,data}){
        let hash,timestamp;
        const lastHash= lastBlock.hash;
        let difficulty;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({originalBlock: lastBlock, timestamp});
            hash = cryptoHash(timestamp,data,lastHash,nonce,difficulty);
        }while(hexToBinary(hash).substring(0,difficulty) !== '0'.repeat(difficulty));

        const minedBlock = new Block({
            data,
            timestamp,
            lastHash,
            nonce,
            difficulty,
            hash
        });

        return minedBlock;
    }

    static adjustDifficulty({originalBlock,timestamp}){
        const {difficulty} = originalBlock;
        const difference = timestamp - originalBlock.timestamp;

        if (difficulty < 1) return 1;
        if(difference < MINE_RATE){
            return difficulty + 1;
        }else{
            return difficulty - 1;
        }

    }
}

module.exports = Block;

