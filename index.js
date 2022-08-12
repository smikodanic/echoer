/**
 * DEX8 library for sending messages, objects, errors ... to console and/or event emitter.
 * Echo message format:
 * echoMsg::{
 *  msg: string|object,
 *  method: 'log'|'objekt'|'error'|'image',
 *  time: string
 * }
 */
const chalk = require('chalk');
const moment = require('moment');



class Echoer {

  constructor(short = true, delay = 100, eventEmitter) {
    this.short = short; // short console log -> string message instead of whole object in __console_log() method
    this.delay = delay; // delay between two consecutive echoes
    this.eventEmitter = eventEmitter; // event emitter - https://nodejs.org/api/events.html
  }


  /**
   * Send comma separated strings to console log and/or event emitter.
   * Use multiple parameters like in console.log, for example: await echo.log('one', 'two', 12, {a: 88})
   * @param {any[]} args - arguments separated by comma
   * @return {void}
   */
  async log(...args) {
    args = args.map(arg => this._toString(arg));
    const msg = args.join(' '); // join with space: echo.log('a', 'b') => args::['a', 'b'] => msg::'a b'
    const time = moment().toISOString();
    const echoMsg = { msg, method: 'log', time };

    this._log_console(echoMsg);
    this._log_event(echoMsg);
    await new Promise(r => setTimeout(r, this.delay)); // delay many consecutive echoes
  }


  /**
   * Send comma separated warnings to console log and/or event emitter.
   * Use multiple parameters like in console.log, for example: await echo.warn('one', 'two', 12, {a: 88})
   * @param {any[]} args - arguments separated by comma
   * @return {void}
   */
  async warn(...args) {
    args = args.map(arg => this._toString(arg));
    const msg = args.join(' '); // join with space: echo.log('a', 'b') => args::['a', 'b'] => msg::'a b'
    const time = moment().toISOString();
    const echoMsg = { msg, method: 'warn', time };

    this._log_console(echoMsg);
    this._log_event(echoMsg);
    await new Promise(r => setTimeout(r, this.delay)); // delay many consecutive echoes
  }


  /**
   * Send error to console log and/or event emitter.
   * Usage: await echo.error(new Error('Scraper error'))
   * @param {Error} err - error
   * @return {void}
   */
  async error(err) {
    const msg = {
      message: err.message,
      stack: err.stack
    };
    const time = moment().toISOString();
    const echoMsg = { msg, method: 'error', time };

    this._log_console(echoMsg);
    this._log_event(echoMsg);
    await new Promise(r => setTimeout(r, this.delay)); // delay many consecutive echoes
  }



  /**
   * Convert object to nice fomatted string and send it to console log and/or event emitter.
   * Usage: await echo.objekt({a:'str', b:55})
   * @param {object} obj - object
   * @return {void}
   */
  async objekt(obj) {
    const msg = obj;
    const time = moment().toISOString();
    const echoMsg = { msg, method: 'objekt', time };

    this._log_console(echoMsg);
    this._log_event(echoMsg);
    await new Promise(r => setTimeout(r, this.delay)); // delay many consecutive echoes
  }



  /**
   * Send image in the base64 format to console log and/or event emitter.
   * Usage: await  echo.image('v1w4fnDx9N5fD4t2ft93Y/88IaZLbaPB8+3O1ef+/+jfXqzzf...');
   * @param {string} img_b64 - image in the base64 (string) format
   * @return {void}
   */
  async image(img_b64) {
    const msg = img_b64;
    const time = moment().toISOString();
    const echoMsg = { msg, method: 'image', time };

    this._log_console(echoMsg);
    this._log_event(echoMsg);
    await new Promise(r => setTimeout(r, this.delay)); // delay many consecutive echoes
  }



  /******** PRIVATE METHODS  *******/
  /**
   * Message to console.
   * @param {object} echoMsg - {msg, method, time}
   * @returns {void}
   */
  _log_console(echoMsg) {
    if (this.short) {
      /* SHORT PRINT */
      const time = moment(echoMsg.time).format('DD.MMM.YYYY HH:mm:ss.SSS');
      if (!!echoMsg && echoMsg.method === 'log') {
        if (echoMsg.msg === '') { console.log(); return; }
        console.log(chalk.greenBright(`(${time})`, echoMsg.msg)); // print string
      } else if (!!echoMsg && echoMsg.method === 'warn') {
        console.log(chalk.yellow(`(${time})`, echoMsg.msg)); // print warning string
      } else if (!!echoMsg && echoMsg.method === 'error') { // print error
        console.log(chalk.redBright(`(${time})`, echoMsg.msg.message));
      } else if (!!echoMsg && echoMsg.method === 'objekt') {
        console.log(chalk.blueBright(`(${time})`, JSON.stringify(echoMsg.msg, null, 2))); // print stringified object
      } else if (!!echoMsg && echoMsg.method === 'image') { // print base64 image
        console.log(chalk.gray(`(${time})`, echoMsg.msg));
      }
    } else {
      /* LONG PRINT */
      const echoMsg2 = JSON.stringify(echoMsg, null, 2);
      if (!!echoMsg && echoMsg.method === 'log') {
        if (echoMsg.msg === '') { console.log(); return; }
        console.log(chalk.greenBright(echoMsg2)); // print string
      } else if (!!echoMsg && echoMsg.method === 'warn') {
        console.log(chalk.yellow(echoMsg2)); // print warning string
      } else if (!!echoMsg && echoMsg.method === 'error') {
        console.log(chalk.redBright(echoMsg2)); // print error
      } else if (!!echoMsg && echoMsg.method === 'objekt') {
        console.log(chalk.blueBright(echoMsg2)); // print object
      } else if (!!echoMsg && echoMsg.method === 'image') {
        console.log(chalk.gray(echoMsg2)); // print base64 image
      }
    }
  }


  /**
   * Message to event emitter.
   * @param {object} echoMsg - {method, msg, time}
   * @returns {void}
   */
  _log_event(echoMsg) {
    if (this.eventEmitter) { this.eventEmitter.emit('echoer', echoMsg); }
  }


  /**
   * Correct input value to string.
   * @param {any} arg - input value
   * @returns {string}
   */
  _toString(arg) {
    if (typeof arg === 'object' || typeof arg === 'boolean') {
      try {
        arg = JSON.stringify(arg, null, 0);
      } catch (err) {
        console.log(err);
      }
    } else if (typeof arg === 'number') {
      arg = arg.toString();
    }

    return arg;
  }




}


module.exports = Echoer;
