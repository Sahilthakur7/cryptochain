const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index.js');

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
    })
});
