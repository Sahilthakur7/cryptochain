const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index.js');
const Blockchain = require('../blockchain');

describe('transaction pool',() => {
    let transactionPool, transaction , senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({senderWallet, recipient: 'fake', amount: 50});
    });

    describe('set transaction', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existing transaction', () => {
        it ('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({inputAddress: senderWallet.publicKey})
            ).toBe(transaction);
        })
    });

    describe('valid transactions', () => {
        let validTransactions,errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for(let i = 0 ; i < 10 ; i++){
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'karanvir',
                    amount: 30
                });

                if(i%3 === 0){
                    transaction.input.amount = 9999999;
                } else if (i % 3 === 1){
                    transaction.input.signature = new Wallet().sign('hello123');
                } else {
                    validTransactions.push(transaction);
                }

                transactionPool.setTransaction(transaction);
            };

        });

        it('returns valid transaction' , () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        })

        it('logs errors for invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        })
    });

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        })
    });

    describe('clear blockchain transactions', () => {
        it('clears the pool of any existing blockchain transactions',() => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for(let i = 0 ; i<6; i++){
                const transaction = new Wallet().createTransaction({
                    recipient: 'foo' , amount: 20
                });

                transactionPool.setTransaction(transaction);

                if(i%2 == 0){
                    blockchain.addBlock({data: [transaction]});
                }else{
                    expectedTransactionMap[transaction.id] = transaction;
                }
            };

            transactionPool.clearBlockchainTransactions({chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });

    })
});
