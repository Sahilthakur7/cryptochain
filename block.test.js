const Block = require('./block');
const { GENESIS_DATA } = require('./config');

describe('Block', () => {
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'my-hash';
    const data = ['my', 'chain'];
    const block = new Block({
        timestamp,
        lastHash,
        data,
        hash
    });

    it('has a timestamp,lasthash,hash and data properties', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    })

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();

        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    });

    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'Mined data';
        const minedBlock = Block.mineBlock({lastBlock,data});

        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it('sets the last hash variable as the hash of last block', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the data correctly', () => {
            expect(minedBlock.data).toEqual(data);
        })

        it('has a timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });
    })
})


