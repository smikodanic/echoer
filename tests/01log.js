const { EventEmitter } = require('events');
const Echoer = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echoer', echoMsg => console.log('EVT::', echoMsg));

const echoer = new Echoer(true, 10, eventEmitter);
// echoer.short = false;

const f1 = async () => {
  await echoer.log('One', 'two', 3, { a: 22 }, true);
};


const f2 = async () => {
  for (let i = 1; i <= 100; i++) {
    await echoer.log(`FOR ${i}`);
  }
};



f1();
f2();
