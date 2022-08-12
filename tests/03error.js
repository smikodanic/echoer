const { EventEmitter } = require('events');
const Echoer = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echoer', echoMsg => console.log('EVT::', echoMsg));

const echoer = new Echoer(true, 10, eventEmitter);
// echoer.short = false;

const f1 = async () => {
  const err = new Error('Very bad error !');
  await echoer.error(err);
};


f1();
