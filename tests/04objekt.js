const { EventEmitter } = require('events');
const Echoer = require('../index.js');

const eventEmitter = new EventEmitter();
eventEmitter.on('echoer', echoMsg => console.log('EVT::', echoMsg));

const echoer = new Echoer(true, 10, eventEmitter);
// echoer.short = false;

const f1 = async () => {
  const obj = { a: 'str', b: 55 };
  await echoer.objekt(obj);
};


f1();
