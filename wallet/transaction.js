const uuid = require('uuid/v1');

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
    }
}

module.exports = Transaction;
