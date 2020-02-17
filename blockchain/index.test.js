const Blockchain = require("./index");
const Block = require("./block");
const { cryptoHash } = require("../util");
const Wallet = require("../wallet");
const Transactin = require("../wallet/transaction");

describe("blockchain", () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });

    it("contains a `chain` array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block to the chain", () => {
        const newData = "foobar";
        blockchain.addBlock({ data: newData });

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
    });

    describe("isValidChain()", () => {
        describe("when the chain does not start with the genesis block", () => {
            it("returns false", () => {
                blockchain.chain[0] = { data: "fake-genesis" };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("when the chain does start with the genesis block", () => {
            beforeEach(() => {
                blockchain.addBlock({ data: "Dwight Schrute" });
                blockchain.addBlock({ data: "Jim Halpert" });
                blockchain.addBlock({ data: "Andy Bernard" });
            });

            describe("and a lastHash reference has changed", () => {
                it("returns false", () => {
                    blockchain.chain[2].lastHash = "broken";

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains a block with invalid field", () => {
                it("returns false", () => {
                    blockchain.chain[2].data = "bad data";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain contains a block with a jumped difficulty", () => {
                it("returns false", () => {
                    const lastBlock = blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    const badBlock = new Block({
                        timestamp,
                        lastHash,
                        difficulty,
                        nonce,
                        data,
                        hash
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe("and the chain does not contain any invalid blocks", () => {
                it("returns true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe("when the new chain is not longer", () => {
            beforeEach(() => {
                newChain.chain[0] = { new: "chain" };
                blockchain.replaceChain(newChain.chain);
            });

            it("does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalChain);
            });

            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "Dwight Schrute" });
                newChain.addBlock({ data: "Jim Halpert" });
                newChain.addBlock({ data: "Andy Bernard" });
            });

            describe("when the new chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].hash = "fakevalue";

                    blockchain.replaceChain(newChain.chain);
                });
                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("when the new chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it("replaces the chain", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it("logs a message", () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe("valid transaction data()", () => {
        let transaction, rewardTransaction, wallet;

        beforeEach(() => {
            wallet = new Wallet();

            transaction = wallet.createTransaction({
                amount: 50,
                recipient: "raju"
            });

            rewardTransaction = Transactin.rewardTransaction({ minerWallet: wallet });
        });

        describe("tranaction data is valid", () => {
            it("return true", () => {
                newChain.addBlock({ data: [transaction, rewardTransaction] });

                expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
                    true
                );
            });
        });

        describe("and the block has multiple rewards", () => {
            it("returns false", () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction, rewardTransaction]
                });
                expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
                    false
                );
            });
        });

        describe("and it has one malformed output index", () => {
            describe("and the tranaction is not a reward transaction", () => {
                it("returns false", () => {
                    transaction.outputMap[wallet.publicKey] = 99999999;

                    newChain.addBlock({ data: [transaction, rewardTransaction] });
                    expect(
                        blockchain.validTransactionData({ chain: newChain.chain })
                    ).toBe(false);
                });
            });

            describe("and the transaction is a reward transaction", () => {
                it("returns false", () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 99999;

                    newChain.addBlock({data: [transaction, rewardTransaction]});
                    expect(
                        blockchain.validTransactionData({chain: newChain.chain})
                    ).toBe(false);
                });
            });
        });

        describe("and the transaction data has at least one malformed input", () => {
            it("returns false", () => {});
        });

        describe("and the block contains duplicate transactions", () => {
            it("returns false", () => {});
        });
    });
});
