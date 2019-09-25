const { GENESIS_DATA } = require('./config');

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
        const minedBlock = new Block({
            timestamp: Date.now(),
            data,
            lastHash: lastBlock.hash,
        });

        return minedBlock;
    }
}

module.exports = Block;

