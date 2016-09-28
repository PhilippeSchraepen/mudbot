'use strict';

const { debug, server, port, messageTimeout } = require('./helpers/settings');
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const TelnetInput = require('telnet-stream').TelnetInput;
const TelnetOutput = require('telnet-stream').TelnetOutput;

class TelnetTalker extends EventEmitter{
  constructor(){
    super();
    this.telnetInput = new TelnetInput();
    this.telnetOutput = new TelnetOutput();
    this.connect();
    this.addEventListeners();
  }

  connect(){
    this.socket = net.createConnection(port, server)
      .setKeepAlive(true)
      .setNoDelay(true)
      .setEncoding('utf8')
    if (debug) this.socket.pipe(this.telnetInput).pipe(process.stdout);
    process.stdin.pipe(this.telnetOutput).pipe(this.socket);
  }

  speakToMUD(message){
    this.telnetOutput.write(message + '\n')
  }

  addEventListeners(){
    let buffer = '';
    this.socket.on('data', chunk => {
      buffer += chunk
      setTimeout( () => {
        this.emit('receivedMessageFromMUD', buffer);
      }, messageTimeout);
    });
  }

}

module.exports = TelnetTalker;
