const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

class Block{
    constructor({timestamp, lastHash, hash, data}){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    static genesis(){
        const genesisBlock = new Block({...GENESIS_DATA})

        return genesisBlock;
    }

    static mineBlock({lastBlock,data}){
        const timestamp= Date.now();
        const lastHash= lastBlock.hash;
        const minedBlock = new Block({
            data,
            timestamp,
            lastHash,
            hash: cryptoHash(timestamp,data,lastHash)
        });

        return minedBlock;
    }
}

module.exports = Block;

