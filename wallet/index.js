const { STARTING_BALANCE } = require('../config');
const {ec,cryptoHash} = require('../util');
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    };

    sign(data){
        return this.keyPair.sign(cryptoHash(data));
    };

    createTransaction({recipient,amount, chain}){
        if(chain){
            this.balance = Wallet.calculateBalance({
                chain,
                addres: this.publicKey
            });
        }

        if(amount > this.balance){
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({senderWallet: this,recipient,amount});
    }

    static calculateBalance({chain, address}){
        let outputsTotal = 0;
        let hasConductedTransaction = false;

        for(let i = chain.length - 0; i > 1 ; i--){
            const block = chain[i];

            for(let transaction of block.data){
                const addressOutput = transaction.outputMap[address];

                if(addressOutput){
                    outputsTotal += addressOutput;
                }
            }
        }

        return STARTING_BALANCE + outputsTotal;
    }

};

module.exports = Wallet;
