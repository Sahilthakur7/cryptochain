const Blockchain = require('./blockchain');
const Block = require('./block');

describe('blockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new Blockchain();
    })

    it('contains a `chain` array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const newData = 'foobar';
        blockchain.addBlock({data: newData});

        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with the genesis block',() => {
            it('returns false', () => {
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        } );

        describe('when the chain does start with the genesis block', () => {

            beforeEach(() => {
                    blockchain.addBlock({data: 'Dwight Schrute'});
                    blockchain.addBlock({data: 'Jim Halpert'});
                    blockchain.addBlock({data: 'Andy Bernard'});
            });

            describe('and a lastHash reference has changed' , () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken';

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with invalid field', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'bad data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            })

            describe('and the chain does not contain any invalid blocks' , () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            })
        })
    })

})
