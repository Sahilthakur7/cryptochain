const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data: 'initial data'});

let prevTimestamp,nextTimestamp,nextBlock,timeDiff,average;

const times = [];

for(let i=0 ; i < 10000 ; i++){
     prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({data: `Block ${i}`});

    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    timeDiff = nextTimestamp - prevTimestamp;

    times.push(timeDiff);

    average = times.reduce((total,num) => (total+num))/times.length;
    console.log("time to mine block", timeDiff);
    console.log("Difficulty", nextBlock.difficulty);
    console.log("average", average);
}




