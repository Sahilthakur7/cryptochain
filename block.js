const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

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
        const {difficulty} = lastBlock;
        let nonce = 0;

        do{
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp,data,lastHash,nonce,difficulty);
        }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

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
}

module.exports = Block;

