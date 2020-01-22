const Wallet = require('./index');
const {verifySignature} = require('../util');
const Transaction = require('./transaction');
const Blockchain = require('../blockchain');
const { STARTING_BALANCE } = require('../config');

describe('Wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet;
    });

    it('has a `balance`', () => {
        expect(wallet).toHaveProperty('balance');
    });

    it('has a publicKey',() => {
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('signing data',() => {
        const data = "foobar";

        it('verifies a signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data)
                })).toBe(true);
        });

        it('does not verify invalid signature', () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false);
        })
    });

    describe('create transaction', () => {
        describe('amount exceeds the balance', () => {
            it('throws an error', () => {
                expect(() => wallet.createTransaction({amount: 999999,recipient: 'Karanvir'})).toThrow('Amount exceeds balance');
            })
        });

        describe('amount is valid', () => {
            let transaction,amount,recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'amit';
                transaction = wallet.createTransaction({amount,recipient});
            });

            it('creates an instance of transaction', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches transaction input matches the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it('outputs the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });
    });

    describe('calculate balance', () => {
        let blockchain;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe('and there are no outputs for the wallet', () => {
            it('has a balance equal to the starting balance', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE);
            })
        });

        describe('and there are outputs for this wallet' , () => {
            let transactionOne, transactionTwo;

            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                });

                transactionTwo = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 70
                });

                blockchain.addBlock({
                    data: [transactionOne, transactionTwo]
                });
            })

            it('adds the sum of all outputs to the wallet balance', () => {

                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE + transactionOne.outputMap[wallet.publicKey] + transactionTwo.outputMap[wallet.publicKey]);
            });
        })
    });
})
