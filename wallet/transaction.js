const uuid = require('uuid/v1');
const { verifySignature } = require('../util');

class Transaction{
    constructor({senderWallet,amount,recipient}){
        this.id = uuid();
        this.outputMap = this.createOutputMap({senderWallet,recipient,amount});
        this.input = this.createInput({senderWallet,outputMap: this.outputMap});
    }

    createOutputMap({senderWallet,amount,recipient}){
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    createInput({senderWallet,outputMap}){
        const input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
        return input;
    };

    static validTransaction(transaction){
        const {input, outputMap} = transaction;
        const {address,amount,signature} = input;

        const outputTotal = Object.values(outputMap).reduce((acc,item) => acc+item, 0);

        if(amount !== outputTotal){
            console.error(`Invalid transaction from ${address}`)
            return false;
        }
        if(!verifySignature({publicKey: address, data: outputMap , signature})){
            console.error(`Invalid transaction from ${address}`)
            return false;
        }

        return true;
    }
}

module.exports = Transaction;
